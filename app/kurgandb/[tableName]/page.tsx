
import Layout, { BreadrumbsArray } from "../comp/PageLayout";

// import type { FGetScheme, FReadDocument } from "../api/route";
import { FGetSchemePage, getScheme } from "../api/methods";
import { TableScheme } from "@artempoletsky/kurgandb/globals";
import PageEditRecords from "./editRecords/PageEditRecords";
import ComponentLoader from "../comp/ComponentLoader";
import TableNotFound from "./TableNotFound";
import { Metadata } from "next";



type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}

export const metadata: Metadata = {
  title: "",
};

export const dynamic = "force-static";


export default async function page({ params }: Props) {
  const { tableName } = params;

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: "", title: tableName },
  ];

  metadata.title = `${tableName} records`;
  const getSchemePage: FGetSchemePage = "getSchemePage" as any;
  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      <ComponentLoader
        method={getSchemePage}
        Component={PageEditRecords}
        args={{ tableName }}
        error={<TableNotFound tableName={tableName} />}
      />
    </Layout>
  );
}