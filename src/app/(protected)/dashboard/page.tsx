"use client";
// src/app/dashboard/page.tsx
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import HunzoNotification from "@/components/notifications";

// Constants for token expiry
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds
const REFRESH_INTERVAL = 1000; // Update countdown every second

export default function DashboardPage() {
  const { user, logout, session, isLoading } = useAuth();
  const [timeUntilRefresh, setTimeUntilRefresh] =
    useState<number>(ACCESS_TOKEN_EXPIRY);
  const lastRefreshedRef = useRef<Date>(new Date());
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    // Update the countdown timer
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastRefreshedRef.current.getTime();
      const remaining = Math.max(0, ACCESS_TOKEN_EXPIRY - elapsed);
      setTimeUntilRefresh(remaining);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once on mount

  // Handle manual refresh
  const handleRefresh = () => {
    lastRefreshedRef.current = new Date();
    setLastRefreshedTime(lastRefreshedRef.current.toLocaleTimeString());
    setTimeUntilRefresh(ACCESS_TOKEN_EXPIRY);
  };

  // Helper function to format time
  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return "Expired";

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const displayName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <HunzoNotification />
              <span className="mr-2">Welcome, {displayName}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="bg-purple-200 le max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        <div className="px-4 py-6 sm:px-0">
          {/* Session Status Card */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Session Status
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Last refreshed: {lastRefreshedTime}
                </span>
                <button
                  onClick={handleRefresh}
                  className="p-1 rounded-full hover:bg-gray-100"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Session Active</span>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-700">
                  Access token refresh in:{" "}
                </span>
                <span className="ml-2 text-sm font-medium">
                  {formatTimeRemaining(timeUntilRefresh)}
                </span>
              </div>
              <div className="mt-1">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                    style={{
                      width: `${Math.max(
                        0,
                        (timeUntilRefresh / ACCESS_TOKEN_EXPIRY) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="size-full flex flex-col gap-4">
            {/* User Data Card */}
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4">User Information</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-2">
                      User Details
                    </h3>
                    <p>
                      <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <p>
                      <span className="font-medium">First Name:</span>{" "}
                      {user?.firstName || "Not set"}
                    </p>
                    <p>
                      <span className="font-medium">Last Name:</span>{" "}
                      {user?.lastName || "Not set"}
                    </p>
                    <p>
                      <span className="font-medium">KYC Status:</span>{" "}
                      <span className="capitalize">{user?.kycStatus}</span>
                    </p>
                    <p>
                      <span className="font-medium">User ID:</span> {user?.id}
                    </p>
                  </div>
                  {session && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg border-b pb-2">
                        Session Information
                      </h3>
                      <p>
                        <span className="font-medium">Browser:</span>{" "}
                        {session.browser}
                      </p>
                      <p>
                        <span className="font-medium">Device:</span>{" "}
                        {session.deviceInfo}
                      </p>
                      <p>
                        <span className="font-medium">IP Address:</span>{" "}
                        {session.ipAddress}
                      </p>
                      <p>
                        <span className="font-medium">Session ID:</span>{" "}
                        {session.id}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* User Wallet Card */}
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4">Wallet Information</h2>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-2">
                      Wallet Details
                    </h3>
                    <p>
                      <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <p>
                      <span className="font-medium">First Name:</span>{" "}
                      {user?.firstName || "Not set"}
                    </p>
                    <p>
                      <span className="font-medium">Last Name:</span>{" "}
                      {user?.lastName || "Not set"}
                    </p>
                    <p>
                      <span className="font-medium">KYC Status:</span>{" "}
                      <span className="capitalize">{user?.kycStatus}</span>
                    </p>
                    <p>
                      <span className="font-medium">User ID:</span> {user?.id}
                    </p>
                  </div>
                  {session && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg border-b pb-2">
                        Session Information
                      </h3>
                      <p>
                        <span className="font-medium">Browser:</span>{" "}
                        {session.browser}
                      </p>
                      <p>
                        <span className="font-medium">Device:</span>{" "}
                        {session.deviceInfo}
                      </p>
                      <p>
                        <span className="font-medium">IP Address:</span>{" "}
                        {session.ipAddress}
                      </p>
                      <p>
                        <span className="font-medium">Session ID:</span>{" "}
                        {session.id}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Transactions Wallet Card */}
            {/* Notifications Wallet Card */}
          </div>
        </div>
        <Link href={"/settings"} className="text-blue-500 underline">
          Change to settings page
        </Link>
      </main>
    </div>
  );
}
