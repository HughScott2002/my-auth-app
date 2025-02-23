"use client";
// src/app/dashboard/page.tsx
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout, session } = useAuth();

  console.log(user);

  // Handle displaying user name
  const displayName =
    user?.firstName || user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={"/dashboard"}>
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </Link>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {displayName}</span>
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-black flex flex-col justify-center items-center">
        <div className="px-4 py-6 sm:px-0">
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
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Session Information
                  </h3>
                  <p>
                    <span className="font-medium">Browser:</span>{" "}
                    {session?.browser}
                  </p>
                  <p>
                    <span className="font-medium">Device:</span>{" "}
                    {session?.deviceInfo}
                  </p>
                  <p>
                    <span className="font-medium">IP Address:</span>{" "}
                    {session?.ipAddress}
                  </p>
                  <p>
                    <span className="font-medium">Session ID:</span>{" "}
                    {session?.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Link href={"/settings"} className="text-blue-500 underline">
          Change to settings page
        </Link>
      </main>
    </div>
  );
}
