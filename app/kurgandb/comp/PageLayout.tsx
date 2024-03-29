import { Breadcrumbs, Button, MantineProvider } from "@mantine/core"

import { ReactNode } from "react"
import { ROOT_PATH } from "../generated";
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";
import Link from "./Link";
import { isAdmin } from "../../kurgandb_admin/auth";
import LoginForm from "./LoginForm";
import Header from "./Header";
import TableHeader from "./TableHeader";

export type BreadrumbsArray = { title: string, href: string }[];


type Props = {
  children: ReactNode
  breadcrumbs?: BreadrumbsArray
  tableName?: string
}

export default async function Layout({ children, breadcrumbs, tableName }: Props) {

  let items: ReactNode[] = [];
  if (breadcrumbs) {
    items = breadcrumbs.map((e, i) => {
      if (!e.href) return <b key={i}>{e.title}</b>;
      return <Link key={i} href={`/${ROOT_PATH}${e.href}`}>{e.title}</Link>;
    })
  }

  const authorised = await isAdmin();

  const setupRequired = authorised === undefined;

  return <MantineProvider>
    {setupRequired &&
      <div className="sticky z-10 top-0 p-3 text-red-800 bg-red-200">
        <p className="">Please set up `isAdmin`, `login` and `logout` methods in `app/kurgandb_admin/auth.ts`!</p>
      </div>
    }
    {authorised || setupRequired
      ? <div className="relative p-3 bg-stone-300 min-h-screen">

        <Header>{tableName && <TableHeader tableName={tableName} />}</Header>
        <div className="">
          <div className="">
            {breadcrumbs && <Breadcrumbs className="mb-3">{items}</Breadcrumbs>}
            {children}
          </div>
        </div>

      </div>
      : <LoginForm />}


  </MantineProvider>
}