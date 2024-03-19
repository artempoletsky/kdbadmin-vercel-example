
import { Metadata } from "next";
import Layout, { BreadrumbsArray } from "../../comp/PageLayout";

import PageCustomComponent from "./PageCustomComponent";
import { FGetTableCustomPageData } from "../../api/methods";
import ComponentLoader from "../../comp/ComponentLoader";
import TableNotFound from "../TableNotFound";

type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}

export const dynamic = "force-static";

export const metadata: Metadata = {};

export default async function page({ params }: Props) {
  const { tableName } = params;
  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Custom" },
  ];

  metadata.title = `${tableName} custom page`;

  const getTableCustomPageData: FGetTableCustomPageData = "getTableCustomPageData" as any;
  return <Layout breadcrumbs={crumbs} tableName={tableName}>
    <ComponentLoader
      method={getTableCustomPageData}
      Component={PageCustomComponent}
      args={{ tableName }}
      error={<TableNotFound tableName={tableName} />}
    />
  </Layout>

}