## Guia de Estudos Sucinto: Autenticação com Fresh e Deno (10 Tasks)

### Tópico 1: Fundamentos e Projeto Inicial

- [x] **Autenticação Essencial:** Estudar conceitos de autenticação web
      (Autenticação, Autorização, Sessões, Cookies) e a importância em Fresh.
      (Recursos: MDN Web Docs sobre Autenticação, Vídeo introdutório -
      pesquisar).
- [x] **Fresh Framework Básico:** Revisar a estrutura do Fresh Framework, rotas
      e criar um projeto inicial. (Recursos: Documentação Fresh).

### Tópico 2: Sessões e Rotas de Autenticação

- [ ] **Cookies de Sessão:** Aprender e implementar `setSessionCookie` e
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
- [ ] Atualizar `import_map.json`: Adicionar `std/` (>= 0.160.0).
- [ ] Atualizar `index.tsx`: Exibir status login (usar `getCookies`).

## Parte 2: Login

- [ ] Criar `<Login>` em `index.tsx`: Formulário POST para `/api/login`
      (username/password).

## Parte 3: Autenticação

- [ ] `routes/api/login.ts`: Função POST (verificar credenciais, definir cookie
      "auth", redirecionar).
- [ ] `routes/logout.ts`: Função GET (remover cookie "auth", redirecionar).

## Parte 4: Integração

- [ ] `index.tsx`: Adicionar `<Login>`/logout (condicional ao status login).
- [ ] Testar: Fluxo login/logout, status, cookie.

## Parte 5: Opcional

- [ ] Redirecionar não logados (`index.tsx` GET).
- [ ] Conteúdo condicional (`index.tsx`).
- [ ] Autenticação robusta (banco de dados, HTTPS, etc.).
