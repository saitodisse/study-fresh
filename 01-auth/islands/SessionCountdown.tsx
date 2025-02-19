// islands/SessionCountdown.tsx
import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface SessionCountdownProps {
  exp: number; // expiration timestamp in milliseconds
}

const formatTime = (milliseconds: number) => {
  if (milliseconds <= 0) return "Expired";
  const totalSeconds = Math.ceil(milliseconds / 1000); // Use ceil instead of floor for smoother transition
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function SessionCountdown(props: SessionCountdownProps) {
  // If not in the browser, render a static version to avoid hydration issues
  if (!IS_BROWSER) {
    return (
      <div class="text-center mt-2">
        <p class="text-lg font-semibold">
          Session expires in: {formatTime(props.exp - Date.now())}
        </p>
      </div>
    );
  }

  const [timeLeft, setTimeLeft] = useState<number>(props.exp - Date.now());

  useEffect(() => {
    const updateTime = () => {
      const remaining = Math.max(0, props.exp - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) {
        window.location.href = "/api/logout";
      }
    };

    updateTime(); // Initial update

    if (props.exp - Date.now() <= 0) return;

    const timer = setInterval(updateTime, 100);
    return () => clearInterval(timer);
  }, [props.exp]);

  // add useEffect to focus on the input when the component mounts
  useEffect(() => {
    const input = document.getElementById("username") as HTMLInputElement;
    input.focus();
  }, []);

  return (
    <div class="text-center mt-2">
      <p class={`text-lg font-semibold ${timeLeft <= 0 ? "text-red-500" : ""}`}>
        Session {timeLeft > 0 ? "expires in: " : ""}
        {formatTime(timeLeft)}
      </p>
    </div>
  );
}
