/*

Toda a lógica de autenticação para este endpoint estará contida na função manipuladora personalizada.

Por simplicidade, nosso nome de usuário e senha serão definidos diretamente no código como "deno" e "land".
(Na maioria das situações de produção, você usaria estratégias de autenticação, tokens de armazenamento
persistente de dados, etc.)

Quando uma requisição POST é feita para /api/login, a função manipuladora personalizada realizará o seguinte:

- extrai o nome de usuário e senha do parâmetro de requisição req
- verifica se correspondem ao nome de usuário e senha definidos no código
- define o cookie de autenticação como 'bar' (em produção, isto deveria ser um valor único por sessão)
  com maxAge de 120 (expirará após 2 minutos)
- retorna as respostas HTTP apropriadas (HTTP 303 força o método de volta para GET, prevenindo
  comportamento estranho no histórico do navegador)

*/

// Importa o tipo Handlers do módulo Fresh server
import { Handlers } from "$fresh/server.ts";
// Importa a função setCookie do módulo padrão HTTP cookie
import { setCookie } from "$std/http/cookie.ts";

import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

// Define o objeto handler que implementa a interface Handlers
export const handler: Handlers = {
  // Define o método POST assíncrono que recebe um objeto Request
  async POST(req) {
    // Cria um objeto URL a partir da URL da requisição
    const url = new URL(req.url);
    // Obtém os dados do formulário da requisição
    const form = await req.formData();

    if (!form.get("password")) {
      const headers = new Headers();

      const message = "Senha inválida. Favor tentar novamente.";

      // Define o cabeçalho de redirecionamento para a página inicial
      headers.set("location", `/?message=${encodeURIComponent(message)}`);

      // Retorna uma resposta com status 403 (Forbidden) se a senha estiver incorreta
      return new Response(null, {
        status: 303,
        headers,
      });
    }

    // Exemplo de hash armazenado (em produção, isto viria de um banco de dados)
    const password_hash = await bcrypt.hash(
      form.get("password") as string,
    );

    // Verifica se o usuário e senha correspondem aos valores hardcoded
    if (form.get("username") === "deno" && form.get("password") === "land") {
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
      headers.set(
        "location",
        "/?password_hash=" + encodeURIComponent(password_hash),
      );
      // Retorna uma resposta vazia com status 303 (See Other) e os cabeçalhos configurados
      return new Response(null, {
        status: 303,
        headers,
      });
    } else {
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
