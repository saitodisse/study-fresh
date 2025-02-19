import { JSX } from "preact";

export function PrimaryButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
    />
  );
}
