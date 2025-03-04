"use client";
// src/app/settings/page.tsx
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-indigo-600 hover:text-indigo-500"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold">Settings</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col items-center size-full">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4">User Settings</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-gray-900">{user?.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-gray-900">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    KYCSTATUS
                  </label>
                  <p className="mt-1 text-gray-900">{user?.kycStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Link href={"/dashboard"} className="text-blue-500 underline">
          Change to dashboard page
        </Link>
      </main>
    </div>
  );
}
// {
//   "session": {
//       "browser": "Postman",
//       "deviceInfo": "PostmanRuntime/7.43.0",
//       "id": "e42e5e85-ff61-4085-9959-92ad6206317c",
//       "ipAddress": "172.18.0.11:46730"
//   },
//   "user": {
//       "email": "test@mail.com",
//       "email": "Michael",
//       "id": "f0a85ef9-79b1-439f-925f-d8e008469928",
//       "kycStatus": "pending",
//       "lastName": "Shelby"
//   }
// }
