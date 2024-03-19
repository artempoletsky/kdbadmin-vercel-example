
import { FGetLogsListPage } from "../api/methods";
import ComponentLoader from "../comp/ComponentLoader";
import Layout from "../comp/PageLayout";
import LogsPage from "./LogsPage";
import { Metadata, ResolvingMetadata } from 'next';


export const metadata: Metadata = {
  title: "",
};

export const dynamic = "force-static";

type Props = {};
export default async function page(props: Props) {

  // const logsList = await getLogsList({});
  metadata.title = `Logs KurganDB`;
  const getLogsListPage = "getLogsListPage" as unknown as FGetLogsListPage;
  return (
    <Layout>
      <ComponentLoader
        method={getLogsListPage}
        Component={LogsPage}
        args={{}}
      />
    </Layout >
  );
}
