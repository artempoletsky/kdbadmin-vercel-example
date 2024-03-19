"use client";
import { getAPIMethod, useErrorResponse } from "@artempoletsky/easyrpc/client";

import CustomComponentTable from "../../../kurgandb_admin/components/CustomComponentTable";
import RequestError from "../../comp/RequestError";
import { useEffect, useState } from "react";
import type { FGetTableCustomPageData, RGetTableCustomPageData } from "../../api/methods";
import { API_ENDPOINT } from "../../generated";
import { TableScheme } from "@artempoletsky/kurgandb/globals";

const getTableCustomPageData = getAPIMethod<FGetTableCustomPageData>(API_ENDPOINT, "getTableCustomPageData");

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