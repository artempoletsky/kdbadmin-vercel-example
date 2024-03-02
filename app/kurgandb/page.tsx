
import { queryUniversal as query } from "@artempoletsky/kurgandb";
import Layout from "./comp/layout";
import CreateNewTable from "./comp/CreateNewTable";
import { ROOT_PATH } from "./generated";
import Link from "./comp/Link";




export default async function () {

  const tableNames: string[] = await query(({ }, { }, { db }) => {
    const tables = db.getTables();
    return Object.keys(tables);
  }, {});

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