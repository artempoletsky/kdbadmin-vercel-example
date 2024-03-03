"use client";
import { useErrorResponse } from "@artempoletsky/easyrpc/client";
import type { TableScheme } from "@artempoletsky/kurgandb/table";

import CustomComponentTable from "../../../kurgandb_admin/components/CustomComponentTable";
import RequestError from "../../comp/RequestError";


export default function CustomComponentPage(props: { tableName: string, scheme: TableScheme }) {

  const [setRequestError, , requestError] = useErrorResponse();

  return (
    <div className="">
      <CustomComponentTable
        tableName={props.tableName}
        onRequestError={setRequestError}
        scheme={props.scheme}
      />
      <RequestError requestError={requestError} />
    </div>
  );
}