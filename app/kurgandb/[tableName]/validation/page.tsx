
import { getScheme } from "../../api/methods";
import Layout, { BreadrumbsArray } from "../../comp/PageLayout";

// import type { FGetScheme, FReadDocument } from "../api/route";

import { TableScheme } from "@artempoletsky/kurgandb/table";




type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}


export const dynamic = "force-dynamic";


export default async function page({ params }: Props) {
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
    { href: "", title: "Validation rules" },
  ];

  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      not implemented yet
    </Layout>
  );
}