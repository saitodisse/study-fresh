// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $index from "./routes/index.tsx";
import * as $level1_middleware from "./routes/level1/_middleware.ts";
import * as $level1_index from "./routes/level1/index.tsx";
import * as $level1_level2_middleware from "./routes/level1/level2/_middleware.ts";
import * as $level1_level2_index from "./routes/level1/level2/index.tsx";
import * as $redirect_to_level_1_middleware from "./routes/redirect-to-level-1/_middleware.ts";
import * as $redirect_to_level_1_index from "./routes/redirect-to-level-1/index.tsx";
import * as $redirect_to_level_2_middleware from "./routes/redirect-to-level-2/_middleware.ts";
import * as $redirect_to_level_2_index from "./routes/redirect-to-level-2/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/index.tsx": $index,
    "./routes/level1/_middleware.ts": $level1_middleware,
    "./routes/level1/index.tsx": $level1_index,
    "./routes/level1/level2/_middleware.ts": $level1_level2_middleware,
    "./routes/level1/level2/index.tsx": $level1_level2_index,
    "./routes/redirect-to-level-1/_middleware.ts":
      $redirect_to_level_1_middleware,
    "./routes/redirect-to-level-1/index.tsx": $redirect_to_level_1_index,
    "./routes/redirect-to-level-2/_middleware.ts":
      $redirect_to_level_2_middleware,
    "./routes/redirect-to-level-2/index.tsx": $redirect_to_level_2_index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
