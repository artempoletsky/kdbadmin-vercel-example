
import Layout, { BreadrumbsArray } from "../comp/layout";

// import type { FGetScheme, FReadDocument } from "../api/route";
import { getScheme } from "../api/route";
import { TableScheme } from "@artempoletsky/kurgandb/table";
import EditTable from "./EditTable";



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
    { href: "", title: tableName },
  ];
  
  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      {scheme
        ? <EditTable tableName={tableName} scheme={scheme} page={1}></EditTable>
        : <div>Table '{tableName}' doesn't exist</div>
      }
    </Layout>
  );
}