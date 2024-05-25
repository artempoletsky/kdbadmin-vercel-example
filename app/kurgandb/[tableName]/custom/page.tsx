
import { Metadata } from "next";


import PageCustomComponent from "./PageCustomComponent";
import { FGetTableCustomPageData } from "../../api/methods";
import ComponentLoader from "../../comp/ComponentLoader";
import TableNotFound from "../TableNotFound";
import { adminRPC } from "../../globals";

type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {};

export default async function page({ params }: Props) {
  const { tableName } = params;

  metadata.title = `${tableName} custom page`;
  return <>
    <ComponentLoader
      method={adminRPC().hack("getTableCustomPageData")}
      Component={PageCustomComponent}
      args={{ tableName }}
      error={<TableNotFound tableName={tableName} />}
    />
  </>

}