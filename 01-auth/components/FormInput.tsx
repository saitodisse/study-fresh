import { JSX } from "preact";

interface FormInputProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, ...props }: FormInputProps) {
  return (
    <div class="mb-6">
      <label class="block text-white" htmlFor={props.id}>
        {label}
      </label>
      <input
        {...props}
        class="mt-2 px-4 py-3 w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}
