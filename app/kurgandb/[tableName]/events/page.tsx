

import Layout, { BreadrumbsArray } from "../../comp/PageLayout";


type Payload = {
  tableName: string,
}
type Props = {
  params: Payload
}

export default async function page({ params }: Props) {
  const { tableName } = params;
  
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