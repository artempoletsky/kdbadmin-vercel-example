
import Layout from "./comp/PageLayout";
import CreateNewTable from "./comp/CreateNewTable";
import { API_ENDPOINT, ROOT_PATH } from "./generated";
import Link from "./comp/Link";
import { getDBVersion, type FGetAllTablesPage } from "./api/methods";
import { Metadata } from "next";
import AllTables from "./comp/AllTables";
import ComponentLoader from "./comp/ComponentLoader";


export const metadata: Metadata = {
  title: "",
}

export const dynamic = "force-static";

export default async function page() {

  const { adminVersion, dbVersion } = await getDBVersion({});

  metadata.title = adminVersion;
  const getAllTablesPage = "getAllTablesPage" as unknown as FGetAllTablesPage;

  return (
    <Layout>
      <div>{adminVersion} / {dbVersion}</div>
      <div className="flex">
        <div className="mt-3 w-[350px]">
          <ComponentLoader
            Component={AllTables}
            method={getAllTablesPage}
            args={{}}
          />
        </div>
        <CreateNewTable />
      </div>
    </Layout>
  );
}