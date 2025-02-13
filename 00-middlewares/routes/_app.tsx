import { type PageProps } from "$fresh/server.ts";

export default function App(props: PageProps) {
  console.log("[*](_app) props.state", props.state);

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>fresh-middleware</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div className="my-2">
          <a className="mx-2" href="/">level 0</a>
          <a className="mx-2" href="/level1/">level 1</a>
          <a className="mx-2" href="/level1/level2/">level 2</a>
        </div>
        <props.Component />
      </body>
    </html>
  );
}
