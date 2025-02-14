/*

All of the authentication logic for this endpoint will be contained in the custom handler function.

For simplicity, our username and password will be hardcoded as “deno” and “land”. (In most production situations, you would use authentication strategies, tokens from persistent data storage, etc.)

When a POST request is made to /api/login, the custom handler function will perform the following:

pulls username and password from the req request parameter
checks against our hardcoded username and password
sets the auth cookie to bar (in production, this should be a unique value per session) with a maxAge of 120 (it will expire after 2 minutes)
and returns the appropriate HTTP responses (HTTP 303 forces the method back to a GET, preventing weird browser history behavior)

*/

// Importa o tipo Handlers do módulo Fresh server
import { Handlers } from "$fresh/server.ts";
// Importa a função setCookie do módulo padrão HTTP cookie
import { setCookie } from "$std/http/cookie.ts";

// Define o objeto handler que implementa a interface Handlers
export const handler: Handlers = {
  // Define o método POST assíncrono que recebe um objeto Request
  async POST(req) {
    // Cria um objeto URL a partir da URL da requisição
    const url = new URL(req.url);
    // Obtém os dados do formulário da requisição
    const form = await req.formData();
    // Verifica se o usuário e senha correspondem aos valores hardcoded
    if (form.get("username") === "deno" && form.get("password") === "land") {
      // Cria um novo objeto Headers para a resposta
      const headers = new Headers();
      // Configura o cookie de autenticação
      setCookie(headers, {
        name: "auth", // Nome do cookie
        value: "bar", // Valor do cookie (deve ser único por sessão!) !!!
        maxAge: 120, // Tempo de vida do cookie em segundos
        sameSite: "Lax", // Configuração de segurança para prevenir ataques CSRF (Cross-Site Request Forgery)
        domain: url.hostname, // Domínio onde o cookie é válido
        path: "/", // Caminho onde o cookie é válido
        secure: true, // Cookie só será enviado em conexões HTTPS
      });

      // Define o cabeçalho de redirecionamento para a página inicial
      headers.set("location", "/");
      // Retorna uma resposta vazia com status 303 (See Other) e os cabeçalhos configurados
      return new Response(null, {
        status: 303,
        headers,
      });
    } else {
      // Cria um novo objeto Headers para a resposta
      const headers = new Headers();

      const message =
        "Credenciais inválidas. Favor tentar novamente com usuário 'deno' e senha 'land'.";

      // Define o cabeçalho de redirecionamento para a página inicial
      headers.set("location", `/?message=${encodeURIComponent(message)}`);

      // Retorna uma resposta com status 403 (Forbidden) se as credenciais estiverem incorretas
      return new Response(null, {
        status: 303,
        headers,
      });
    }
  },
};
