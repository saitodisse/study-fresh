import { useSignal } from "@preact/signals"; // For reactivity

export default function MyIsland() {
  const count = useSignal(0); // A reactive signal

  return (
    <div className="p-4 bg-gray-900 rounded-xl shadow-lg">
      <div className="flex flex-row justify-center items-center space-x-6">
        <button
          className="w-14 h-14 bg-indigo-600 rounded-full shadow-md text-4xl text-white font-extrabold hover:bg-indigo-700 transition duration-200"
          onClick={() => (count.value -= 1)}
        >
          ➖
        </button>
        <div className="w-20 h-20 flex items-center justify-center bg-gray-700 rounded-full text-4xl font-bold text-yellow-300 shadow-inner">
          {count}
        </div>
        <button
          className="w-14 h-14 bg-indigo-600 rounded-full shadow-md text-4xl text-white font-extrabold hover:bg-indigo-700 transition duration-200"
          onClick={() => (count.value += 1)}
        >
          ➕
        </button>
      </div>
    </div>
  );
}
