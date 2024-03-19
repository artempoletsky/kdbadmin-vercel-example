
import PageTableScheme from "./PageTableScheme"
import type { FGetSchemePage } from "../../api/methods"
import Layout, { BreadrumbsArray } from "../../comp/PageLayout"
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

export const dynamic = "force-static";

export default async function page({ params }: Props) {
  const { tableName } = params;
  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Edit scheme" },
  ];

  metadata.title = `${tableName} scheme`;

  const getSchemePage: FGetSchemePage = "getSchemePage" as any;
  return <Layout breadcrumbs={crumbs} tableName={tableName}>
    <ComponentLoader
      method={getSchemePage}
      Component={PageTableScheme}
      args={{ tableName }}
      error={<TableNotFound tableName={tableName} />}
    />
    {/* <PageTableScheme tableName={tableName}></PageTableScheme> */}
  </Layout>
}