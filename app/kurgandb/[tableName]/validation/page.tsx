
import PageValidation from "./PageValidation";
import { Metadata } from "next";

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

export const dynamic = "force-dynamic";

export default async function page({ params }: Props) {
  const { tableName } = params;

  metadata.title = `${tableName} events`;

  const getTableValidation: FGetTableValidation = "getTableValidation" as any;
  return (
    <ComponentLoader
      method={getTableValidation}
      Component={PageValidation}
      args={{ tableName }}
      error={<TableNotFound tableName={tableName} />}
    />
  );
}