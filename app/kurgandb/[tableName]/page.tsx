
import Layout, { BreadrumbsArray } from "../comp/PageLayout";

// import type { FGetScheme, FReadDocument } from "../api/route";
import { getScheme } from "../api/methods";
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

export const dynamic = "force-dynamic";


export default async function page({ params }: Props) {
  const { tableName } = params;
  let scheme: TableScheme | undefined;
  try {
    scheme = await getScheme({
      tableName
    });
  } catch (error) {
    // console.log(error);
  }

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: "", title: tableName },
  ];
  
  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      {scheme
        ? <EditTable tableName={tableName} scheme={scheme} page={1}></EditTable>
        : <div>Table &#39;{tableName}&#39; doesn&#39;t exist</div>
      }
    </Layout>
  );
}