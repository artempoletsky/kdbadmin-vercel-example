

import CreateNewTable from "../comp/CreateNewTable";

import { getDBVersion, type FGetAllTablesPage } from "../api/methods";
import { Metadata } from "next";
import PageTables from "./PageTables";
import ComponentLoader from "../comp/ComponentLoader";


export const metadata: Metadata = {
  title: "",
}

export const dynamic = "force-dynamic";

export default async function page() {

  const { adminVersion, dbVersion } = await getDBVersion({});

  metadata.title = adminVersion;
  const getAllTablesPage = "getAllTablesPage" as unknown as FGetAllTablesPage;

  return (
    <>
      <div>{adminVersion} / {dbVersion}</div>
      <div className="flex">
        <div className="mt-3 w-[350px]">
          <ComponentLoader
            Component={PageTables}
            method={getAllTablesPage}
            args={{}}
          />
        </div>
        <CreateNewTable />
      </div>
    </>
  );
}