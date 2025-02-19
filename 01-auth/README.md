## TODO

- [x] (01-auth\routes\bcrypt\forgot-password.tsx) Corrigir o envio de email
- [ ] tentar mover o password-reset para dentro do usuário
- [ ] Criar confirmação para verificar se o email é realmente válido

---

## Guia de Estudos Sucinto: Autenticação com Fresh e Deno (10 Tasks)

### Tópico 1: Fundamentos e Projeto Inicial

- [x] **Autenticação Essencial:** Estudar conceitos de autenticação web
      (Autenticação, Autorização, Sessões, Cookies) e a importância em Fresh.
      (Recursos: MDN Web Docs sobre Autenticação, Vídeo introdutório -
      pesquisar).
- [x] **Fresh Framework Básico:** Revisar a estrutura do Fresh Framework, rotas
      e criar um projeto inicial. (Recursos: Documentação Fresh).

### Tópico 2: Sessões e Rotas de Autenticação

- [x] **Cookies de Sessão:** Aprender e implementar `setSessionCookie` e
      `getSession` em Fresh, incluindo segurança de cookies. (Recursos:
      Documentação Fresh, exemplos de cookies em Fresh).
- [ ] **Rota de Login:** Criar rota `/auth/login` com formulário e lógica de
      autenticação simulada (usuário/senha fixos), setando cookie de sessão.
- [ ] **Rota de Logout:** Criar rota `/auth/logout` para invalidar cookie de
      sessão e redirecionar.[x] Concluída

### Tópico 3: Proteção e Refinamento

- [ ] **Middleware de Autenticação:** Implementar middleware para proteger
      rotas, verificando sessão e redirecionando para login se necessário.
- [ ] **Persistência Simples:** Simular persistência de usuários com um array e
      hash de senhas (biblioteca Deno para hash).
- [ ] **Autenticação Real (Visão Geral):** Pesquisar sobre integração com banco
      de dados e autenticação em aplicações reais Fresh.

### Revisão Final

- [ ] **Revisão e Testes:** Revisar código, resumos e testar o sistema de
      autenticação completo. (Recursos: Artigo "Setup auth with Fresh").

**Legenda:**

- [ ] Pendente: Tarefa ainda não iniciada ou incompleta.
- [x] Concluída: Tarefa finalizada.

**Instruções:**

1. **Substitua os textos entre colchetes** com os links e recursos específicos.
2. **Marque o status das tarefas** conforme as completa.
3. **Use este guia como checklist** para um aprendizado rápido e focado em
   autenticação com Fresh e Deno.

Este guia conciso oferece um caminho direto para aprender os pontos chave da
autenticação em Fresh. Adapte e aprofunde-se conforme necessário!

---

## Parte 1: Configuração

- [x] Criar projeto Fresh: `deno run -A -r https://fresh.deno.dev my-auth-app`
- [x] Remover arquivos:
      `rm -rf islands/Counter.tsx routes/api/joke.ts routes/\[name\].tsx`
- [x] Atualizar `import_map.json`: Adicionar `std/` (>= 0.160.0).
- [x] Atualizar `index.tsx`: Exibir status login (usar `getCookies`).

## Parte 2: Login

- [x] Criar `<Login>` em `index.tsx`: Formulário POST para `/api/login`
      (username/password).

## Parte 3: Autenticação

- [x] `routes/api/login.ts`: Função POST (verificar credenciais, definir cookie
      "auth", redirecionar).
- [x] `routes/logout.ts`: Função GET (remover cookie "auth", redirecionar).

## Parte 4: Integração

- [x] `index.tsx`: Adicionar `<Login>`/logout (condicional ao status login).
- [x] Testar: Fluxo login/logout, status, cookie.

## Parte 5: Opcional

- [x] Redirecionar não logados (`index.tsx` GET).
- [x] Conteúdo condicional (`index.tsx`).

---

- [ ] Autenticação robusta (banco de dados, HTTPS, etc.).

## Sugestões de melhoria

"o que poderia ser melhorado para deixar o login um pouco mais seguro, pronto
para produção. Responda em pt-br"

GitHub Copilot: # Sugestões de Melhorias de Segurança para o Login

1. **Implementar uma Senha Hash**
   - Nunca armazenar senhas em texto puro
   - Usar algoritmos seguros como bcrypt ou Argon2

```typescript
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

// Exemplo de hash armazenado (em produção, isto viria de um banco de dados)
const STORED_PASSWORD_HASH = await bcrypt.hash("land");

// Na função de verificação:
const isValidPassword = await bcrypt.compare(
  form.get("password"),
  STORED_PASSWORD_HASH,
);
```

2. **Implementar Token JWT para Sessão**
   - Substituir o valor fixo "bar" por um token JWT
   - Incluir informações relevantes do usuário de forma segura

```typescript
import { create as createJWT } from "https://deno.land/x/djwt@v2.9/mod.ts";

const sessionToken = await createJWT({
  alg: "HS512",
  typ: "JWT",
}, {
  userId: "user123",
  exp: new Date().getTime() + (120 * 1000), // 120 segundos
}, "SUA_CHAVE_SECRETA");

// No setCookie:
setCookie(headers, {
  name: "auth",
  value: sessionToken,
  // ...outros parâmetros
});
```

3. **Implementar Rate Limiting**
   - Limitar tentativas de login por IP/usuário
   - Prevenir ataques de força bruta

```typescript
const RATE_LIMIT_MAP = new Map<string, number>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos

export function checkRateLimit(ip: string): boolean {
  const attempts = RATE_LIMIT_MAP.get(ip) || 0;
  if (attempts >= MAX_ATTEMPTS) {
    return false;
  }
  RATE_LIMIT_MAP.set(ip, attempts + 1);
  return true;
}
```

4. **Outras Melhorias Recomendadas:**

- Implementar autenticação em duas etapas (2FA)
- Usar HTTPS sempre (já está configurado com `secure: true`)
- Armazenar credenciais em um banco de dados seguro
- Implementar logs de tentativas de login para auditoria
- Adicionar validação de força da senha
- Implementar tempo de expiração da sessão mais longo com refresh tokens
- Adicionar proteção contra ataques de XSS com flags de cookie adequadas
- Implementar CAPTCHA para prevenir ataques automatizados

5. **Exemplo de Validações Básicas**

```typescript
export function validateLoginInput(
  username: string,
  password: string,
): boolean {
  if (!username || !password) return false;
  if (username.length < 3 || password.length < 8) return false;
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false;
  return true;
}
```

Estas melhorias tornariam sua aplicação mais segura e adequada para um ambiente
de produção. Lembre-se de que segurança é um processo contínuo e deve ser
regularmente revisado e atualizado.

saitodisse: converta sua resposta para Markdown para que eu possa copiar

GitHub Copilot: # Melhorias de Segurança para o Login

## 1. Implementar Senha Hash

```typescript
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

## 2. Implementar JWT para Sessão

```typescript
import { create, verify } from "https://deno.land/x/djwt@v2.9/mod.ts";

const SECRET_KEY = Deno.env.get("JWT_SECRET") || "sua-chave-secreta";

export async function createToken(userId: string): Promise<string> {
  return await create(
    { alg: "HS512", typ: "JWT" },
    {
      userId,
      exp: new Date().getTime() + (120 * 1000),
    },
    SECRET_KEY,
  );
}
```

## 3. Rate Limiting

```typescript
const RATE_LIMIT = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = RATE_LIMIT.get(ip);

  if (!attempt) {
    RATE_LIMIT.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - attempt.timestamp > BLOCK_DURATION) {
    RATE_LIMIT.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempt.count++;
  return true;
}
```

## 4. Login Handler Modificado

```typescript
import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { verifyPassword } from "../../utils/password.ts";
import { createToken } from "../../utils/jwt.ts";
import { checkRateLimit } from "../../utils/rateLimit.ts";

// Hash armazenado da senha (em produção, deve vir do banco de dados)
const STORED_PASSWORD_HASH = "$2a$10$..."; // Hash da senha "land"

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const form = await req.formData();
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(clientIp)) {
      const headers = new Headers();
      headers.set(
        "location",
        "/?message=Muitas tentativas. Tente novamente mais tarde.",
      );
      return new Response(null, { status: 303, headers });
    }

    const username = form.get("username");
    const password = form.get("password");

    if (
      username === "deno" &&
      await verifyPassword(password as string, STORED_PASSWORD_HASH)
    ) {
      const headers = new Headers();
      const token = await createToken(username);

      setCookie(headers, {
        name: "auth",
        value: token,
        maxAge: 120,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
        httpOnly: true, // Previne acesso via JavaScript
      });

      headers.set("location", "/");
      return new Response(null, { status: 303, headers });
    }

    // ... resto do código existente para erro de autenticação ...
  },
};
```

## 5. Validações

```typescript
export function validateLoginInput(
  input: { username: string; password: string },
): {
  isValid: boolean;
  error?: string;
} {
  if (!input.username || !input.password) {
    return { isValid: false, error: "Username e senha são obrigatórios" };
  }

  if (input.username.length < 3) {
    return {
      isValid: false,
      error: "Username deve ter pelo menos 3 caracteres",
    };
  }

  if (input.password.length < 8) {
    return { isValid: false, error: "Senha deve ter pelo menos 8 caracteres" };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(input.username)) {
    return {
      isValid: false,
      error: "Username deve conter apenas letras, números e _",
    };
  }

  return { isValid: true };
}
```

## Configuração de Ambiente

```bash
JWT_SECRET=sua-chave-secreta-muito-longa-e-aleatoria
PASSWORD_SALT_ROUNDS=10
```

## Checklist de Segurança Adicional

- [ ] Implementar HTTPS em produção
- [ ] Configurar logs de auditoria
- [ ] Implementar autenticação 2FA
- [ ] Adicionar CAPTCHA
- [ ] Configurar política de senhas forte
- [ ] Implementar sistema de refresh tokens
- [ ] Configurar headers de segurança (HSTS, CSP, etc)
- [ ] Implementar backup e recuperação de conta
