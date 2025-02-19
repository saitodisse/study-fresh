import { useSignal } from "@preact/signals"; // For reactivity
import { DevBorder } from "../components/DevBorder.tsx";

export default function MyCounterIsland() {
  const count = useSignal(0); // A reactive signal

  const getCounterColor = (value: number) => {
    if (value < 0) return "text-red-500";
    if (value > 0) return "text-green-500";
    return "text-white";
  };

  return (
    <DevBorder componentName="MyCounterIsland">
      <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl">
        <div className="flex flex-row justify-center items-center space-x-8">
          <button
            className={`w-24 h-24 bg-indigo-600 rounded-full shadow-2xl text-6xl text-white font-extrabold hover:bg-indigo-700 transition duration-100`}
            onClick={() => (count.value -= 1)}
          >
            ➖
          </button>
          <div
            className={`w-28 h-28 flex items-center justify-center bg-gray-700 rounded-full text-6xl font-bold ${
              getCounterColor(count.value)
            } shadow-inner`}
          >
            {count}
          </div>
          <button
            className={`w-24 h-24 bg-indigo-600 rounded-full shadow-2xl text-6xl text-white font-extrabold hover:bg-indigo-700 transition duration-100`}
            onClick={() => (count.value += 1)}
          >
            ➕
          </button>
        </div>
      </div>
    </DevBorder>
  );
}
