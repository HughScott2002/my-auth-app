// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthStore } from "@/lib/auth";

export interface Notification {
  notification_id: string;
  account_id: string;
  is_read: boolean;
  was_dismissed: boolean;
  label: string;
  content: string;
  date: string;
  type: string | null;
  icon: string | null;
  priority: string;
  category: string;
  action_url: string | null;
}

interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  page_size: number;
  unread_count: number;
}

export function useNotifications() {
  const { user } = useAuthStore();
  const accountId = user?.id || "23423423423443";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false); // Changed to false by default for testing endpoint
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  // Add a flag to determine which endpoint to use
  const useTestingEndpoint = true; // Set to false to use the paginated endpoint

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (pageNumber = 1, resetList = false) => {
      try {
        setLoading(true);
        setError(null);

        // Choose endpoint based on flag
        const endpoint = useTestingEndpoint
          ? `http://localhost/api/notifications/all-for-testing`
          : `http://localhost/api/notifications`;

        const response = await axios.get<NotificationResponse>(endpoint, {
          params: {
            page: pageNumber,
            page_size: pageSize,
            account_id: accountId,
          },
        });

        const newNotifications = response.data.notifications;
        setTotal(response.data.total);
        setUnreadCount(response.data.unread_count);

        // For testing endpoint, always replace the list and disable pagination
        if (useTestingEndpoint) {
          setNotifications(newNotifications);
          setAllLoaded(true);
          setHasMore(false);
        } else {
          // Normal pagination logic
          if (resetList) {
            setNotifications(newNotifications);
          } else {
            setNotifications((prev) => [...prev, ...newNotifications]);
          }
          setHasMore(pageNumber * pageSize < response.data.total);
          setAllLoaded(pageNumber * pageSize >= response.data.total);
        }

        setPage(pageNumber);
      } catch (err) {
        setError("Failed to fetch notifications");
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, accountId, useTestingEndpoint]
  );

  // Initial fetch
  useEffect(() => {
    fetchNotifications(1, true);

    const interval = setInterval(() => {
      fetchNotifications(1, true);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Load more notifications - only does something when not using testing endpoint
  const loadMore = useCallback(() => {
    if (!loading && hasMore && !useTestingEndpoint) {
      fetchNotifications(page + 1);
    }
  }, [fetchNotifications, loading, hasMore, page, useTestingEndpoint]);

  // Mark a notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        // Optimistic update
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.notification_id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        await axios.put(
          `http://localhost/api/notifications/${notificationId}/read`
        );
      } catch (err) {
        console.error("Error marking notification as read:", err);
        fetchNotifications(1, true);
      }
    },
    [fetchNotifications]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);

      await axios.put(`http://localhost/api/notifications/read-all`, null, {
        params: { account_id: accountId },
      });
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      fetchNotifications(1, true);
    }
  }, [fetchNotifications, accountId]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    total,
    allLoaded,
  };
}
