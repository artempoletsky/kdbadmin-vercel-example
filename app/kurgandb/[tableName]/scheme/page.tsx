
import EditTableScheme from "./EditTableScheme"
import { getScheme } from "../../api/methods"
import Layout, { BreadrumbsArray } from "../../comp/PageLayout"


type Payload = {
  tableName: string
}
type Props = {
  params: Payload
}

export const dynamic = "force-dynamic";

export default async function page({ params }: Props) {
  const { tableName } = params;
  const scheme = await getScheme(params);
  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Edit scheme" },
  ];

  return <Layout breadcrumbs={crumbs} tableName={tableName}>
    <EditTableScheme tableName={tableName} scheme={scheme}></EditTableScheme>
  </Layout>
}