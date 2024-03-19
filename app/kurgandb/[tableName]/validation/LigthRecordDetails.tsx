
import { PlainObject } from "@artempoletsky/kurgandb/globals";
import { ReactNode } from "react";

type Props = {
  record: PlainObject;
  primaryKey: string;
}

export function LightRecordDetails({ record, primaryKey }: Props) {


  function printObj() {
    const result: ReactNode[] = [];
    for (const key in record) {
      result.push(<li key={key}>{key}: {record[key] + ""}</li>)
    }
    return result;
  }
  return <details className="">
    <summary>{record[primaryKey]}</summary>
    <ul>
      {printObj()}
    </ul>

  </details>
}