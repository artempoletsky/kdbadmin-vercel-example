
import { getSchemeSafe } from "../../api/methods";
import Layout, { BreadrumbsArray } from "../../comp/PageLayout";

import CustomComponentPage from "./CustomComponentPage";
import TableNotFound from "../TableNotFound";


type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}


export default async function page({ params }: Props) {
  const { tableName } = params;
  const scheme = await getSchemeSafe({
    tableName
  });

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: `/${tableName}/`, title: tableName },
    { href: "", title: "Custom" },
  ];

  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      {scheme ?
        <CustomComponentPage scheme={scheme} tableName={tableName} />
        : <TableNotFound tableName={tableName} />
      }
    </Layout>
  );
}