export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col">
        <ul class="space-y-4">
          <li>
            <a
              href="/docs/01-understanding-auth"
              className="underline hover:text-gray-300"
            >
              Autenticação vs Autorização
            </a>
          </li>
          <li>
            <a
              href="/docs/02-sessions"
              className="underline hover:text-gray-300"
            >
              Sessões
            </a>
          </li>
          <li>
            <a
              href="/docs/03-cookies"
              className="underline hover:text-gray-300"
            >
              Cookies
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
