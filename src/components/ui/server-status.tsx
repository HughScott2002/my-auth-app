// src/components/ui/server-status.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";

interface ServerStatusProps {
  isDown: boolean;
}

export default function ServerStatus({ isDown }: ServerStatusProps) {
  if (!isDown) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <div className="flex">
        <WifiOff className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
        <div>
          <AlertTitle className="text-red-700">Server Unavailable</AlertTitle>
          <AlertDescription className="text-red-600">
            The server is currently unavailable. Your actions will be cached and
            synchronized when the connection is restored.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
