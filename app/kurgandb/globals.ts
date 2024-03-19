import { JSONErrorResponse, RequestErrorSetter } from "@artempoletsky/easyrpc/client";
import { PlainObject } from "@artempoletsky/kurgandb/globals";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";





export type ScriptsRecord = Record<string, (args: any) => void>;
export type FieldScriptsObject = Record<string, Record<string, ScriptsRecord>>;


export type TableComponentProps = {
  onRequestError: RequestErrorSetter;
  tableName: string;
  scheme: TableScheme;
  meta: any;
}

export type DocumentComponentProps = {
  onRequestError: (e: JSONErrorResponse) => void
  // onUpdateRecord: (record: PlainObject) => void
  tableName: string
  record: PlainObject
  insertMode?: boolean
  recordId: string | number | undefined
}
