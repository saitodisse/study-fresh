import { JSX } from "preact";

export function PrimaryLink(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      class="text-blue-300 hover:text-blue-400 hover:underline"
    />
  );
}
