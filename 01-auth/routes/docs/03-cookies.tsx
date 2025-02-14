export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-row space-x-2 items-center justify-between w-full">
          <h1 class="text-3xl font-bold">Cookies</h1>
          <img
            class="my-6"
            src="/logo.svg"
            width="32"
            height="32"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
        </div>
        <div className="container mx-auto max-w-screen-md p-8 rounded-lg bg-[#161616] bg-opacity-50">
          <h2 class="text-xl font-bold mt-6 mb-4">Definição</h2>
          <p class="my-4">
            São pequenos arquivos de texto que um site armazena no navegador do
            usuário para manter informações entre diferentes sessões de
            navegação.
          </p>

          <h2 class="text-xl font-bold mt-6 mb-4">Utilidades</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>Informações de Sessão:</strong>{" "}
              Armazenam o ID de sessão, permitindo que o servidor identifique o
              usuário.
            </li>
            <li>
              <strong>Personalização:</strong>{" "}
              Guardam preferências de idioma, tema e outras configurações do
              usuário.
            </li>
            <li>
              <strong>Análise:</strong>{" "}
              Permitem rastrear o comportamento do usuário para fins de análise
              e publicidade.
            </li>
          </ul>

          <h2 class="text-xl font-bold mt-6 mb-4">Tipos de Cookies</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>Session Cookies:</strong>{" "}
              Temporários, existem apenas durante a sessão do navegador.
            </li>
            <li>
              <strong>Persistent Cookies:</strong>{" "}
              Permanecem no navegador por um período determinado.
            </li>
            <li>
              <strong>First-party Cookies:</strong>{" "}
              Criados pelo site que você está visitando.
            </li>
            <li>
              <strong>Third-party Cookies:</strong>{" "}
              Criados por outros domínios (geralmente para publicidade).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
