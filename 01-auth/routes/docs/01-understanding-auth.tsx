export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto bg-[#5a2e9b]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">01 - entendendo autenticação</h1>
        <p class="my-4">
          Aqui vamos entender como funciona a autenticação. Quais são as
          diferenças entre autenticação e autorização?
        </p>
      </div>
    </div>
  );
}
