import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  error: Error | null;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get the API URL from environment variables or use a default
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Initialize socket connection
    const socketInstance = io(apiUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    // Set up event listeners
    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError(err);
      setConnected(false);
    });

    // Save socket instance
    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, connected, error };
};
