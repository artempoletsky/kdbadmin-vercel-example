"use client";
import { ValidationErrorResponce } from "@artempoletsky/easyrpc/client";
import type { TableScheme } from "@artempoletsky/kurgandb/table";

import CustomComponentTable from "../../../kurgandb_admin/components/CustomComponentTable";
import RequestError from "../../comp/RequestError";
import { useState } from "react";



export default function CustomComponentPage(props: { tableName: string, scheme: TableScheme }) {

  const [requestError, setRequestError] = useState<ValidationErrorResponce | undefined>(undefined);

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