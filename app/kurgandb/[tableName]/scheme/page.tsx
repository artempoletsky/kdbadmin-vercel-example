
import PageTableScheme from "./PageTableScheme"
import type { FGetSchemePage } from "../../api/methods"

import ComponentLoader from "../../comp/ComponentLoader"
import TableNotFound from "../TableNotFound"
import { Metadata } from "next"


type Payload = {
  tableName: string
}
type Props = {
  params: Payload
}

export const metadata: Metadata = {
  title: "",
};

export const dynamic = "force-dynamic";

export default async function page({ params }: Props) {
  const { tableName } = params;


  metadata.title = `${tableName} scheme`;

  const getSchemePage: FGetSchemePage = "getSchemePage" as any;
  return <ComponentLoader
    method={getSchemePage}
    Component={PageTableScheme}
    args={{ tableName }}
    error={<TableNotFound tableName={tableName} />}
  />
}