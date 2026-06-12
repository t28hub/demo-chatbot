# @demo-chatbot/db

Persistence layer for the demo chatbot monorepo, built on [PGlite][pglite] and [Drizzle ORM][drizzle].

[pglite]: https://pglite.dev
[drizzle]: https://orm.drizzle.team

## Installation

From a workspace package directory:

```sh
pnpm add @demo-chatbot/db --workspace
```

## Usage

Create a client with `createClient`, then query through Drizzle:

```ts
import { uuid } from "@demo-chatbot/core";
import { chat, createClient } from "@demo-chatbot/db";

const client = createClient("idb://demo-chatbot");

await client.insert(chat).values({id: uuid(), title: "New Chat"});
const chats = await client.select().from(chat);
```
