// Importa o tipo Handlers do módulo Fresh server
import { Handlers } from "$fresh/server.ts";
// Importa a função deleteCookie do módulo padrão HTTP cookie
import { deleteCookie } from "$std/http/cookie.ts";

// Define o objeto handler que implementa a interface Handlers
export const handler: Handlers = {
  // Define o método GET que recebe um objeto Request
  GET(req) {
    // Cria um objeto URL a partir da URL da requisição
    const url = new URL(req.url);
    // Cria um novo objeto Headers copiando os cabeçalhos da requisição
    const headers = new Headers(req.headers);
    // Remove o cookie de autenticação usando o mesmo domínio e caminho
    deleteCookie(headers, "auth", { path: "/", domain: url.hostname });

    // Define o cabeçalho de redirecionamento para a página inicial
    headers.set("location", "/");
    // Retorna uma resposta vazia com status 302 (Found/Redirect) e os cabeçalhos configurados
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
