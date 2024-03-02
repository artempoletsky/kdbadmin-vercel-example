import { Button } from "@mantine/core";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { ROOT_PATH } from "../generated";
import { ReactNode } from "react";



export default function Header(props: { children?: ReactNode }) {

  return <div className="flex gap-3 mb-3">
    <div className="grow">
      {props.children}
    </div>
    <Link href={`/${ROOT_PATH}/scripts`}><Button>Scripts</Button></Link>
    <LogoutButton />
  </div>
}