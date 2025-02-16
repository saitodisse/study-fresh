// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_login from "./routes/api/login.ts";
import * as $api_logout from "./routes/api/logout.ts";
import * as $api_types_User from "./routes/api/types/User.ts";
import * as $bcrypt_login from "./routes/bcrypt/login.tsx";
import * as $bcrypt_signin from "./routes/bcrypt/signin.tsx";
import * as $docs_01_understanding_auth from "./routes/docs/01-understanding-auth.tsx";
import * as $docs_02_sessions from "./routes/docs/02-sessions.tsx";
import * as $docs_03_cookies from "./routes/docs/03-cookies.tsx";
import * as $index from "./routes/index.tsx";
import * as $users_all_users from "./routes/users/all-users.tsx";
import * as $users_delete_username_ from "./routes/users/delete/[username].tsx";

import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/login.ts": $api_login,
    "./routes/api/logout.ts": $api_logout,
    "./routes/api/types/User.ts": $api_types_User,
    "./routes/bcrypt/login.tsx": $bcrypt_login,
    "./routes/bcrypt/signin.tsx": $bcrypt_signin,
    "./routes/docs/01-understanding-auth.tsx": $docs_01_understanding_auth,
    "./routes/docs/02-sessions.tsx": $docs_02_sessions,
    "./routes/docs/03-cookies.tsx": $docs_03_cookies,
    "./routes/index.tsx": $index,
    "./routes/users/all-users.tsx": $users_all_users,
    "./routes/users/delete/[username].tsx": $users_delete_username_,
  },
  islands: {},
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
