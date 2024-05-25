import { ReactNode } from "react";
import { ROOT_PATH } from "../generated";
import Link from "./Link";
import { Breadcrumbs as MantineBreadcrumbs } from "@mantine/core";

export type BreadcrumbsArray = { title: string, href: string }[];

type Props = {
  crumbs: BreadcrumbsArray | null;
}
export default function Breadcrumbs({ crumbs }: Props) {
  let items: ReactNode[] = [];
  if (crumbs) {
    items = crumbs.map((e, i) => {
      if (!e.href) return <b key={i}>{e.title}</b>;
      return <Link key={i} href={`/${ROOT_PATH}${e.href}`}>{e.title}</Link>;
    })
  }
  return <MantineBreadcrumbs className="mb-3">{items}</MantineBreadcrumbs>
}