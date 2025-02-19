import { type PageProps } from "$fresh/server.ts";
import HeaderMenu from "../components/HeaderMenu.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html className="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>01-auth</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="dark:bg-gray-800 dark:text-slate-200">
        <HeaderMenu />
        <div class="px-8 py-8 mx-auto max-w-screen-lg">
          <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl">
            <div class="max-w-screen-md mx-auto flex flex-col">
              <Component />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
