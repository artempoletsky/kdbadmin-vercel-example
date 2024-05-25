

import { FGetSchemePage, getScheme } from "../../api/methods";
import { TableScheme } from "@artempoletsky/kurgandb/globals";
import PageEditRecords from "./PageEditRecords";
import ComponentLoader from "../../comp/ComponentLoader";
import TableNotFound from "../TableNotFound";
import { Metadata } from "next";
import { adminRPC } from "../../globals";



type Payload = {
  tableName: string,
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


  // if (Store.setBreadcrumbs)
  // useEffect(() => {
  //   Store.setBreadcrumbs(crumbs);
  // })

  metadata.title = `${tableName} records`;
  // const getSchemePage: FGetSchemePage = "getSchemePage" as any;
  return (
    <>
      <ComponentLoader
        method={adminRPC().hack("getSchemePage")}
        Component={PageEditRecords}
        args={{ tableName }}
        error={<TableNotFound tableName={tableName} />}
      />
    </>
  );
}