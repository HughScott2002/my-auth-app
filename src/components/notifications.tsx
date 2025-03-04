// src/components/notification.tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BellDot, CheckCheck, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { format, isToday, isYesterday } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";

// Simple classnames utility to replace cn
const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

const HunzoNotification = () => {
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState("16rem");
  const contentRef = useRef<HTMLDivElement>(null);

  // Mark notifications as read when dropdown opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      // Optional: Mark visible notifications as read when dropdown opens
    }
  }, [isOpen, notifications, unreadCount, markAsRead]);

  // Update max height based on screen size and expanded state
  useEffect(() => {
    const updateMaxHeight = () => {
      if (contentRef.current) {
        const windowHeight = window.innerHeight;
        const contentRect = contentRef.current.getBoundingClientRect();
        const maxAvailableHeight = windowHeight - contentRect.top - 20; // 20px buffer
        setMaxHeight(
          isExpanded
            ? `${maxAvailableHeight - (20 / 100) * maxAvailableHeight}px`
            : "16rem"
        );
      }
    };
    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);
    return () => window.removeEventListener("resize", updateMaxHeight);
  }, [isExpanded]);

  // Handle infinite scroll when expanded
  useEffect(() => {
    if (isExpanded && hasMore && !loading) {
      // Load more notifications when expanded
      loadMore();
    }
  }, [isExpanded, hasMore, loading, loadMore]);

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <div className="relative cursor-pointer">
          <BellDot className="size-9 p-2" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white text-black w-80 bg-hunzo-background-grey rounded-md shadow-md z-50"
          ref={contentRef}
        >
          <div className="flex justify-between items-center w-full h-full text-sm font-semibold px-4 py-2">
            <span className="h-full w-full">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </span>
            {unreadCount > 0 && (
              <button
                className="flex gap-1 -p-2 text-hunzo-blue"
                onClick={() => markAllAsRead()}
              >
                <CheckCheck className="size-5" />
                <span className="font-semibold">Mark all as read</span>
              </button>
            )}
          </div>

          <hr className="text-hunzo-pitch-black bg-hunzo-text-grey" />

          <div
            className="overflow-y-auto transition-all duration-300 ease-in-out px-4"
            id="notification-scroll-container"
            style={{ maxHeight }}
          >
            {notifications.length === 0 && !loading ? (
              <div className="py-6 text-center text-gray-500">
                No notifications to display
              </div>
            ) : (
              <InfiniteScroll
                dataLength={notifications.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<div className="text-center py-2">Loading more...</div>}
                scrollableTarget="notification-scroll-container"
                endMessage={
                  <div className="text-center py-2 text-sm text-gray-500">
                    No more notifications
                  </div>
                }
              >
                {notifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={classNames(
                      "py-2",
                      !notification.is_read && "bg-blue-50 rounded"
                    )}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.notification_id);
                      }
                    }}
                  >
                    <NotificationItem data={notification} />
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </div>

          <div className="flex items-center justify-between w-full text-xs font-semibold px-2 py-2">
            <button
              className="text-hunzo-dark-blue hover:underline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "See all notifications"}
            </button>
            <Link href={"/settings/notifications"}>
              <Settings className="size-5 mr-1" />
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default HunzoNotification;

function NotificationItem({ data }: { data: Notification }) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, yyyy h:mm a");
    }
  };

  return (
    <div className="flex gap-2 w-full">
      {data.icon && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
          <img
            src={data.icon}
            alt={data.label}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col w-full my-2 gap-2">
        <span className="text-hunzo-dark-blue font-bold capitalize text-sm">
          {data.label}
        </span>
        <span className="text-sm font-medium text-hunzo-pitch-black">
          {data.content}
        </span>
        <span className="text-xs font-semibold text-hunzo-text-grey">
          {formatDate(data.date)}
        </span>
        {data.type === "action" && (
          <div className="flex gap-4 w-full">
            <button className="border-2 border-hunzo-blue px-6 py-1 rounded hover:bg-gray-50">
              Cancel
            </button>
            <button className="bg-hunzo-blue text-white px-6 py-1 rounded hover:bg-blue-700">
              Transfer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
