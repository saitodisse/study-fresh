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
      <body className="dark:bg-gray-800 dark:text-white">
        <HeaderMenu />
        <Component />
      </body>
    </html>
  );
}
