
import { getScheme } from "../../api/route";
import Layout, { BreadrumbsArray } from "../../comp/layout";

// import type { FGetScheme, FReadDocument } from "../api/route";

import { TableScheme } from "@artempoletsky/kurgandb/table";
import CustomComponentPage from "./CustomComponentPage";


type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}


export default async function ({ params }: Props) {
  const { tableName } = params;
  let scheme: TableScheme;
  try {
    scheme = await getScheme({
      tableName
    });
  } catch (err: any) {
    console.log(err);
    return err.message;
  }

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Custom" },
  ];

  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      <CustomComponentPage scheme={scheme} tableName={tableName} />
    </Layout>
  );
}