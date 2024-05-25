import { JSONErrorResponse, RequestErrorSetter } from "@artempoletsky/easyrpc/client";
import { PlainObject } from "@artempoletsky/kurgandb/globals";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";
import { RPC } from "@artempoletsky/easyrpc/client";
import * as API from "./api/methods";
import { API_ENDPOINT } from "./generated";
import { customAPI } from "../kurgandb_admin/api";



export type ScriptsRecord = Record<string, (args: any) => void>;
export type FieldScriptsObject = Record<string, Record<string, ScriptsRecord>>;


export type TableComponentProps = {
  onRequestError: RequestErrorSetter;
  tableName: string;
  scheme: TableScheme;
  meta: any;
}

export type DocumentComponentProps<Type = PlainObject> = {
  onRequestError: RequestErrorSetter;
  // onUpdateRecord: (record: PlainObject) => void;
  tableName: string;
  record: Type & PlainObject;
  insertMode?: boolean;
  recordId: string | number | undefined;
}


export function adminRPC() {
  return RPC<typeof API>(API_ENDPOINT);
}

export function adminRPCCustom() {
  return RPC<typeof customAPI>(API_ENDPOINT);
}