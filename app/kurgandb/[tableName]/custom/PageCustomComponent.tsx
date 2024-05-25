"use client";
import { useErrorResponse } from "@artempoletsky/easyrpc/react";

import CustomComponentTable from "../../../kurgandb_admin/components/CustomComponentTable";
import RequestError from "../../comp/RequestError";
import { TableScheme } from "@artempoletsky/kurgandb/globals";


type Props = {
  tableName: string;
  scheme: TableScheme;
  meta: any;
}

export default function PageCustomComponent(props: Props) {

  const [setRequestError, , requestError] = useErrorResponse();
  return (
    <div className="">
      <CustomComponentTable
        {...props}
        onRequestError={setRequestError}
      />
      <RequestError requestError={requestError} />
    </div>
  );
}