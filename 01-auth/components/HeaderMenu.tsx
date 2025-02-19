import { PrimaryLink } from "./PrimaryLink.tsx";

export default function HeaderMenu() {
  return (
    <header className="bg-blue-900 shadow-lg">
      <nav className="max-w-screen-lg mx-auto px-4 py-3">
        <PrimaryLink
          href="/"
          className="text-white hover:text-blue-200 text-xl font-semibold"
        >
          Home
        </PrimaryLink>
      </nav>
    </header>
  );
}
