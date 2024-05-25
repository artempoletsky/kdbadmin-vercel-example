
import PageEvents from "./PageEvents";
import { Metadata } from "next";

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

export const dynamic = "force-dynamic";

export default async function page({ params }: Props) {
  const { tableName } = params;


  metadata.title = `${tableName} events`;

  const getTableEvents: FGetTableEvents = "getTableEvents" as any;
  return (
    <ComponentLoader
      method={getTableEvents}
      Component={PageEvents}
      args={{ tableName }}
      error={<TableNotFound tableName={tableName} />}
    />
  );
}