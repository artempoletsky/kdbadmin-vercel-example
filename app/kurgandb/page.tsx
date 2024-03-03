
import Layout from "./comp/PageLayout";
import CreateNewTable from "./comp/CreateNewTable";
import { API_ENDPOINT, ROOT_PATH } from "./generated";
import Link from "./comp/Link";
import { getAllTables, type FGetAllTables } from "./api/methods";
import { getAPIMethod } from "@artempoletsky/easyrpc/client";

import { headers, cookies } from 'next/headers'


// const hrs = headers();

// console.log(hrs.get("host"));
// console.log(hrs.get("protocol"));
// console.log(cookies());

// const getAllTables = getAPIMethod<FGetAllTables>("http://" + hrs.get("host") + API_ENDPOINT, "getAllTables", {
//   cache: "no-cache"
// });

// export const dynamic = "force-dynamic";

export const dynamic = "force-dynamic";

export default async function page() {

  const tableNames: string[] = await getAllTables({});

  return (
    <Layout>
      <div>KurganDB</div>
      <div className="flex">
        <ul className="mt-3 w-[350px]">
          {tableNames.map(id => <li className="mb-1" key={id}><Link href={`/${ROOT_PATH}/${id}/`}>{id}</Link></li>)}
        </ul>
        <CreateNewTable />
      </div>
    </Layout>
  );
}