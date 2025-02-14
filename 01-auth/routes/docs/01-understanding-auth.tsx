export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto bg-[#261342]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-row space-x-2 items-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="64"
            height="64"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-3xl font-bold">01 - entendendo autenticação</h1>
        </div>
        <div className="container mx-auto max-w-screen-md p-4 rounded-lg bg-[#442179]">
          <p class="my-4">
            <strong>Autenticação</strong>: A autenticação é o processo de
            verificar a identidade de um usuário. Em outras palavras, ela
            responde à pergunta: "Quem é você?"
          </p>
          <p class="my-4">
            <strong>Autorização</strong>: A autorização é o processo de
            verificar se um usuário tem permissão para acessar um recurso. Em
            outras palavras, ela responde à pergunta: "Você pode fazer isso?"
          </p>

          <h2 class="text-xl font-bold mt-6 mb-4">Métodos de Autenticação</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>Autenticação básica:</strong>{" "}
              o usuário fornece suas credenciais (nome de usuário e senha) em
              cada requisição.
            </li>
            <li>
              <strong>Autenticação por cookies:</strong>{" "}
              o servidor gera um cookie com informações sobre o usuário
              autenticado e o envia para o navegador. O navegador envia o cookie
              em requisições subsequentes, permitindo que o servidor identifique
              o usuário.
            </li>
            <li>
              <strong>Autenticação por tokens:</strong>{" "}
              o servidor gera um token (um código único) que é enviado para o
              cliente. O cliente usa o token para se autenticar em requisições
              futuras.
            </li>
          </ul>

          <h2 class="text-xl font-bold mt-6 mb-4">Mais sobre Autorização</h2>
          <p class="my-4">
            A autorização é o processo de determinar quais recursos ou
            funcionalidades um usuário autenticado tem permissão para acessar.
            Em outras palavras, ela responde à pergunta: "O que você tem
            permissão para fazer?"
          </p>
          <p class="my-4">
            A autorização geralmente é baseada em regras ou políticas que
            definem os níveis de acesso para diferentes usuários ou grupos de
            usuários. Por exemplo, um usuário pode ter permissão para ler
            informações, mas não para modificá-las.
          </p>

          <h3 class="text-lg font-bold mt-4 mb-2">Modelos de Autorização</h3>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>Controle de acesso baseado em papéis (RBAC):</strong>{" "}
              usuários são atribuídos a papéis (por exemplo, administrador,
              editor, leitor) e cada papel tem permissões específicas.
            </li>
            <li>
              <strong>Controle de acesso baseado em atributos (ABAC):</strong>
              {" "}
              o acesso é concedido com base em atributos do usuário, do recurso
              e do contexto (por exemplo, hora, local).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
