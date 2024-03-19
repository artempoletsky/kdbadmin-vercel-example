
import PageEvents from "./PageEvents";
import { Metadata } from "next";
import Layout, { BreadrumbsArray } from "../../comp/PageLayout";
// import { getTableEvents } from "../../api/methods";
import ComponentLoader from "../../comp/ComponentLoader";
import { FGetTableEvents } from "../../api/methods";
import TableNotFound from "../TableNotFound";


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
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Events" },
  ];

  metadata.title = `${tableName} events`;

  const getTableEvents: FGetTableEvents = "getTableEvents" as any;
  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      <ComponentLoader
        method={getTableEvents}
        Component={PageEvents}
        args={{ tableName }}
        error={<TableNotFound tableName={tableName} />}
      />
    </Layout>
  );
}