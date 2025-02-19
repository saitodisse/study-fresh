import { useSignal } from "@preact/signals"; // For reactivity

export default function MyIsland() {
  const count = useSignal(0); // A reactive signal

  return (
    <div>
      Counter is at {count}.{" "}
      <button onClick={() => (count.value += 1)}>+</button>
    </div>
  );
}
