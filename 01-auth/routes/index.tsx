export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">01 - Auth</h1>
        <p class="my-4">
          <a href="/docs/01-understanding-auth" className="underline">
            Autenticação vs Autorização
          </a>
        </p>
      </div>
    </div>
  );
}
