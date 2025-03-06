// src/components/WalletCard.tsx
import { RefreshCw, AlertCircle } from "lucide-react";
import { useWallets } from "@/hooks/useWallets";

// Helper to format currency amounts
function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

// Helper to format dates

// Helper to get status badge class
function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "suspended":
      return "bg-yellow-100 text-yellow-800";
    case "disabled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Wallet skeleton loading UI
function WalletSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        </div>
      </div>
    </div>
  );
}

export default function WalletCard() {
  const { wallets, loading, error, isServerDown, refresh } = useWallets();

  if (loading) {
    return (
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Wallet Information</h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <WalletSkeleton />
        </div>
      </div>
    );
  }

  if (isServerDown || error) {
    return (
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Wallet Information</h2>
          <button
            onClick={refresh}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
            <h3 className="text-lg font-semibold mb-1">
              Wallet Service Unavailable
            </h3>
            <p className="text-gray-600 mb-4">
              We&apos;re unable to fetch your wallet information at the moment.
            </p>
            <button
              onClick={refresh}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Wallet Information</h2>
          <button
            onClick={refresh}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center py-6">
            <p className="text-gray-600">No wallets found for your account.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Wallet Information</h2>
        <button
          onClick={refresh}
          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>
      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div key={wallet.walletId} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">{wallet.type} Wallet</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                      wallet.status
                    )}`}
                  >
                    {wallet.status}
                  </span>
                  {wallet.isDefault && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </div>
                <div className="text-sm text-gray-500">Available Balance</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm border-b pb-2">
                  Wallet Details
                </h4>
                <p className="flex justify-between">
                  <span className="font-medium">Wallet ID:</span>
                  <span className="text-gray-700 font-mono text-sm">
                    {wallet.walletId.substring(0, 8)}...
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Currency:</span>
                  <span className="text-gray-700">{wallet.currency}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Created:</span>
                  <span className="text-gray-700">
                    {new Date(wallet.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Last Activity:</span>
                  <span className="text-gray-700">
                    {wallet.lastActivity
                      ? new Date(wallet.lastActivity).toLocaleDateString()
                      : "Never"}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm border-b pb-2">Limits</h4>
                <p className="flex justify-between">
                  <span className="font-medium">Daily Limit:</span>
                  <span className="text-gray-700">
                    {formatCurrency(wallet.dailyLimit, wallet.currency)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Monthly Limit:</span>
                  <span className="text-gray-700">
                    {formatCurrency(wallet.monthlyLimit, wallet.currency)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
