"use client";
// src/components/token-expiry.tsx
import { useState, useEffect } from "react";

function getCookieExpiry(cookieName: string): Date | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      // We can't directly get the expiry time from a cookie in the browser
      // If your cookie has a specific format that includes expiry, you could parse it
      return null;
    }
  }

  return null;
}

function getTimeUntilExpiry(expiryDate: Date | null): string {
  if (!expiryDate) return "Unknown";

  const now = new Date();
  const timeLeft = expiryDate.getTime() - now.getTime();

  if (timeLeft <= 0) return "Expired";

  const secondsLeft = Math.floor(timeLeft / 1000);
  const minutesLeft = Math.floor(secondsLeft / 60);
  const hoursLeft = Math.floor(minutesLeft / 60);
  const daysLeft = Math.floor(hoursLeft / 24);

  if (daysLeft > 0) {
    return `${daysLeft} days, ${hoursLeft % 24} hours`;
  } else if (hoursLeft > 0) {
    return `${hoursLeft} hours, ${minutesLeft % 60} minutes`;
  } else if (minutesLeft > 0) {
    return `${minutesLeft} minutes, ${secondsLeft % 60} seconds`;
  } else {
    return `${secondsLeft} seconds`;
  }
}

// For demonstration purposes, we'll use estimated expiry times
const TokenExpiry = () => {
  const [accessTokenExpiry, setAccessTokenExpiry] = useState<Date | null>(null);
  const [refreshTokenExpiry, setRefreshTokenExpiry] = useState<Date | null>(
    null
  );
  const [timeRemaining, setTimeRemaining] = useState({
    access: "Unknown",
    refresh: "Unknown",
  });

  // Check if cookies exist
  const hasCookies = () => {
    return (
      document.cookie.includes("access_token") ||
      document.cookie.includes("refresh_token")
    );
  };

  useEffect(() => {
    // For demonstration, we'll set estimated expiry times
    // In reality, you'd get these from your API or decode them from JWTs
    if (document.cookie.includes("access_token")) {
      // Access token typically expires in 15 minutes
      const accessExpiry = new Date();
      accessExpiry.setMinutes(accessExpiry.getMinutes() + 15);
      setAccessTokenExpiry(accessExpiry);
    }

    if (document.cookie.includes("refresh_token")) {
      // Refresh token typically expires in 7 days
      const refreshExpiry = new Date();
      refreshExpiry.setDate(refreshExpiry.getDate() + 7);
      setRefreshTokenExpiry(refreshExpiry);
    }
  }, []);

  useEffect(() => {
    if (!hasCookies()) return;

    const updateTimeRemaining = () => {
      setTimeRemaining({
        access: getTimeUntilExpiry(accessTokenExpiry),
        refresh: getTimeUntilExpiry(refreshTokenExpiry),
      });
    };

    // Update immediately
    updateTimeRemaining();

    // Then update every second
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [accessTokenExpiry, refreshTokenExpiry]);

  if (!hasCookies()) {
    return null;
  }

  return (
    <div className="mt-4 text-sm text-center text-gray-500 border-t pt-4">
      <p className="font-medium mb-1">Authentication Status:</p>
      {document.cookie.includes("access_token") && (
        <p>
          Access Token:{" "}
          <span className="text-indigo-600">{timeRemaining.access}</span>
        </p>
      )}
      {document.cookie.includes("refresh_token") && (
        <p>
          Refresh Token:{" "}
          <span className="text-indigo-600">{timeRemaining.refresh}</span>
        </p>
      )}
    </div>
  );
};

export default TokenExpiry;
