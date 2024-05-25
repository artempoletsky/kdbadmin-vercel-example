
import { Breadcrumbs, Button, MantineProvider } from "@mantine/core"

import { ReactNode, useState } from "react"
// import "@mantine/core/styles.layer.css";
// import "@mantine/dates/styles.layer.css";
import { isAdmin } from "../kurgandb_admin/auth";
import LoginForm from "./comp/LoginForm";
import Header from "./comp/Header";

import "./store";
import { StoreProvider } from "@artempoletsky/easystore";

import "./admin.css"


type Props = {
  children: ReactNode;
}

export default async function Layout({ children }: Props) {

  const authorised = await isAdmin();

  const setupRequired = authorised === undefined;

  return (
    <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/@mantine/core@7.7.1/styles.layer.css" />
        <link rel="stylesheet" href="https://unpkg.com/@mantine/dates@7.7.1/styles.layer.css" />
      </head>
      <body>
        <MantineProvider>
          {setupRequired &&
            <div className="sticky z-10 top-0 p-3 text-red-800 bg-red-200">
              <p className="">Please set up `isAdmin`, `login` and `logout` methods in `app/kurgandb_admin/auth.ts`!</p>
            </div>
          }
          {authorised || setupRequired
            ? <div className="relative p-3 bg-stone-300 min-h-screen">
              <StoreProvider>
                <Header></Header>
                {children}
              </StoreProvider>
            </div>
            : <LoginForm />}
        </MantineProvider>
      </body>
    </html>
  )
}