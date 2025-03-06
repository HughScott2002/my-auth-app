// src/hooks/useWallets.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthStore } from "@/lib/auth";

export interface Wallet {
  walletId: string;
  accountId: string;
  type: string;
  balance: number;
  currency: string;
  status: string;
  isDefault: boolean;
  dailyLimit: number;
  monthlyLimit: number;
  lastActivity: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useWallets() {
  const { user } = useAuthStore();
  const accountId = user?.id || "4f2449bc-09ff-47d1-8d43-25d4da96f58e"; // Default ID for testing

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isServerDown, setIsServerDown] = useState(false);

  const fetchWallets = useCallback(async () => {
    if (!accountId) {
      setWallets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsServerDown(false);

      const response = await axios.get<Wallet[]>(
        `http://localhost/api/wallets/list/${accountId}`,
        {
          timeout: 5000, // 5 second timeout
        }
      );

      setWallets(response.data);
    } catch (err) {
      console.error("Error fetching wallets:", err);
      setError("Failed to fetch wallet information");
      setIsServerDown(true);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return {
    wallets,
    loading,
    error,
    isServerDown,
    refresh: fetchWallets,
  };
}
