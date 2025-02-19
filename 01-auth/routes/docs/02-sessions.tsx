export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-row space-x-2 items-center justify-between w-full">
          <h1 class="text-2xl font-bold">Sessões</h1>
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
            São mecanismos utilizados para manter o estado de um usuário
            autenticado durante sua interação com um site ou aplicativo.
          </p>

          <h2 class="text-xl font-bold mt-6 mb-4">Funcionamento</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>Criação da Sessão:</strong>{" "}
              Após o usuário se autenticar, o servidor cria uma sessão e
              armazena informações sobre o usuário, como seu ID, nome e
              permissões.
            </li>
            <li>
              <strong>Identificador Único:</strong>{" "}
              Um identificador único (ID de sessão) é enviado para o navegador
              do usuário, geralmente através de um cookie.
            </li>
            <li>
              <strong>Manutenção do Estado:</strong>{" "}
              O navegador envia o ID de sessão em todas as requisições
              subsequentes, permitindo que o servidor identifique o usuário e
              mantenha seu estado.
            </li>
          </ul>

          <h2 class="text-xl font-bold mt-6 mb-4">Benefícios</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>Mantém o usuário autenticado entre diferentes páginas</li>
            <li>Permite armazenar dados temporários do usuário</li>
            <li>Mais seguro que armazenar dados sensíveis no cliente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
