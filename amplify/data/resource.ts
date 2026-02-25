import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Stores: a
    .model({
      name: a.string().required(),
      address: a.string().required(),
      area: a.string().required(),
      is_open_now: a.boolean().required(),
      phone_number: a.string(),
      brand_number: a.integer().required(),
      display_brand_ids: a.string().array().required(),
      review_count: a.integer(),
      description: a.string(),
      site_url: a.string(),
      business_hours: a.string(),
    })
    .authorization((allow) => [
      allow.guest().to(['read', 'create']),
      allow.authenticated(),
    ]),
  Brands: a
    .model({
      name: a.string().required(),
      name_kana: a.string(),
      description: a.string(),
      birth_place: a.string(),
      found_year: a.integer(),
    })
    .authorization((allow) => [
      allow.guest().to(['read', 'create']),
      allow.authenticated(),
    ]),
  StoreBrand: a
    .model({
      store_id: a.id().required(),
      brand_id: a.id().required(),
    })
    .identifier(['store_id', 'brand_id'])
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated(),
    ]),
  Favorites: a
    .model({
      user_id: a.id().required(),
      // 店舗かブランドを判定するためのフィールド
      target_type: a.string().required(),
      target_id: a.id().required(),
    })
    .identifier(['user_id', 'target_type', 'target_id'])
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
