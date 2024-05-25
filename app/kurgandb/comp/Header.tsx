"use client";
import { Button } from "@mantine/core";
import LogoutButton from "./LogoutButton";
import Link from "./Link";
import { ROOT_PATH } from "../generated";
import { useContext } from "react";

import TableHeader from "./TableHeader";
import { useStore } from "../store";




export default function Header() {
  const [tableName] = useStore("tableName");
  return <div className="flex gap-3 mb-3">
    <Link href={`/${ROOT_PATH}/`}><Button>Tables</Button></Link>

    <div className="grow">
      {tableName && <TableHeader tableName={tableName} />}
    </div>
    <Link href={`/${ROOT_PATH}/plugins`}><Button>Plugins</Button></Link>
    <Link href={`/${ROOT_PATH}/scripts`}><Button>Scripts</Button></Link>
    <Link href={`/${ROOT_PATH}/logs`}><Button>Logs</Button></Link>
    <LogoutButton />
  </div>
}