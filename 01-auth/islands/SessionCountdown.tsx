// islands/SessionCountdown.tsx
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface SessionCountdownProps {
  exp: number;
}

export default function SessionCountdown(props: SessionCountdownProps) {
  const timeLeft = useSignal(props.exp - Date.now());

  useEffect(() => {
    // Initial calculation
    const initialTimeLeft = Math.max(0, props.exp - Date.now());
    timeLeft.value = initialTimeLeft;

    if (initialTimeLeft <= 0) return;

    const timer = setInterval(() => {
      const remaining = Math.max(0, props.exp - Date.now());
      timeLeft.value = remaining;

      if (remaining <= 0) {
        clearInterval(timer);
        window.location.href = "/api/logout";
      }
    }, 100);

    return () => clearInterval(timer);
  }, [props.exp]);

  const formatTime = (milliseconds: number) => {
    if (milliseconds <= 0) return "Expired";
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div class="text-center mt-2">
      <p
        class={`text-lg font-semibold ${
          timeLeft.value <= 0 ? "text-red-500" : ""
        }`}
      >
        Session {timeLeft.value > 0 ? "expires in: " : ""}
        {formatTime(timeLeft.value)}
      </p>
    </div>
  );
}
