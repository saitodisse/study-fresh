export default function HeaderMenu() {
  return (
    <header className="bg-[#442179] shadow-lg">
      <nav className="container mx-auto px-4 py-3">
        <ul className="flex space-x-6 justify-between">
          <li>
            <a href="/" className="text-white hover:text-gray-300">Indice</a>
          </li>
          <li>
            <a href="/login" className="text-white hover:text-gray-300">
              Login
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
