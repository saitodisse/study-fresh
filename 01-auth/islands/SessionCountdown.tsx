// islands/SessionCountdown.tsx
import { useEffect, useState } from "preact/hooks";

interface SessionCountdownProps {
  exp: number; // expiration timestamp in milliseconds
}

export default function SessionCountdown(props: SessionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(props.exp - Date.now());

  useEffect(() => {
    // Initial calculation
    const initialTimeLeft = Math.max(0, props.exp - Date.now());
    setTimeLeft(initialTimeLeft);

    // Only start timer if we have time left
    if (initialTimeLeft <= 0) return;

    // Update every 100ms for smoother counting
    const timer = setInterval(() => {
      const remaining = Math.max(0, props.exp - Date.now());
      console.log("remaining", remaining);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        window.location.href = "/api/logout"; // Redirect to logout when session expires
      }
    }, 100);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, [props.exp]);

  const formatTime = (milliseconds: number) => {
    if (milliseconds <= 0) return "Expired";
    const totalSeconds = Math.ceil(milliseconds / 1000); // Use ceil instead of floor for smoother transition
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div class="text-center mt-2">
      <p class={`text-lg font-semibold ${timeLeft <= 0 ? "text-red-500" : ""}`}>
        Session {timeLeft > 0 ? "expires in: " : ""}
        {formatTime(timeLeft)}
      </p>
    </div>
  );
}
