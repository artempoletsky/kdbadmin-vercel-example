
import { getScheme } from "../../api/route";
import Layout, { BreadrumbsArray } from "../../comp/layout";

// import type { FGetScheme, FReadDocument } from "../api/route";

import { TableScheme } from "@artempoletsky/kurgandb/table";




type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}

type QueryReturn = false | {
  ids: string[]
  scheme: any
  pagesCount: number
}

export default async function ({ params }: Props) {
  const { tableName } = params;
  let scheme: TableScheme | undefined;
  try {
    scheme = await getScheme({
      tableName
    });
  } catch (error) {
    console.log(error);
  }

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Events" },
  ];

  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      not implemented yet
    </Layout>
  );
}