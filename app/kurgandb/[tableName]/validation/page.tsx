
import PageValidation from "./PageValidation";
import { Metadata } from "next";
import Layout, { BreadrumbsArray } from "../../comp/PageLayout";
import { FGetTableValidation, getTableValidation } from "../../api/methods";
import ComponentLoader from "../../comp/ComponentLoader";
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
    { href: "", title: "Validation rules" },
  ];

  metadata.title = `${tableName} events`;

  const getTableValidation: FGetTableValidation = "getTableValidation" as any;
  return (
    <Layout breadcrumbs={crumbs} tableName={tableName}>
      <ComponentLoader
        method={getTableValidation}
        Component={PageValidation}
        args={{ tableName }}
        error={<TableNotFound tableName={tableName} />}
      />
    </Layout>
  );
}