// src/components/ui/alert.tsx
import React from "react";
import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}

export function Alert({
  children,
  variant = "default",
  className = "",
}: AlertProps) {
  const baseStyles = "p-4 border rounded-md flex items-start space-x-2";

  const variantStyles = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <div className={combinedStyles} role="alert">
      {children}
    </div>
  );
}

export function AlertTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h5 className={`font-medium text-base ${className}`}>{children}</h5>;
}

export function AlertDescription({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`text-sm mt-1 ${className}`}>{children}</div>;
}
