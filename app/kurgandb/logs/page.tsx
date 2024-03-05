
import { getLogsList } from "../api/methods";
import Layout from "../comp/PageLayout";
import LogsPage from "./LogsPage";
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Logs KurganDB",
};

export const dynamic = "force-dynamic";

type Props = {};
export default async function page(props: Props) {

  const logsList = await getLogsList({});
  metadata.title = `Logs(${logsList.length}) KurganDB`;

  return (
    <Layout>
      <LogsPage logsList={logsList}></LogsPage>
    </Layout >
  );
}
