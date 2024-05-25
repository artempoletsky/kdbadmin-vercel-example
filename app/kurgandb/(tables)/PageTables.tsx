"use client";

import Link from "../comp/Link";
import { ROOT_PATH } from "../generated";
import { useEffect, useState } from "react";
import { useStore, useStoreEffectSet } from "../store";


type Props = {
  tables: string[]
}
export default function PageTables({ tables }: Props) {
  useStoreEffectSet("tableName", "");
  if (!tables.length) return "No tables created yet";
  return <ul>
    {tables.map(id => <li className="mb-1" key={id}><Link href={`/${ROOT_PATH}/${id}/records/`}>{id}</Link></li>)}
  </ul>
}