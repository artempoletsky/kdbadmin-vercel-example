"use client";

import { ReactNode, useEffect, useState } from "react";
import FunctionComponent from "./FunctionComponent";
import Log from "./Log";
import type { ScriptsLogRecord } from "../api/methods";
import { useStoreEffectSet } from "../store";



export type ParsedFunction = {
  description: string
  args: string[]
}

export type Group = {
  [key: string]: {
    fun?: ParsedFunction | false,
    children?: Group,
  }
}

type Props = {
  scripts: Group
}

export function formatName(key: string) {
  if (key.startsWith("confirm")){
    key = key.slice(8);
  }
  return key.replaceAll("_", " ");
}

export default function PageScripts({ scripts }: Props) {
  useStoreEffectSet("tableName", "");
  const [log, setLog] = useState<ScriptsLogRecord[]>([]);
  function onLog(record: ScriptsLogRecord) {
    setLog(log => log.concat(record));
  }


  function printGroup(group: Group, path: string, key: string) {
    const items: ReactNode[] = [];


    for (const key in group) {
      const item = group[key];
      const newPath = `${path}.${key}`;

      if (item.children) {
        items.push(printGroup(item.children, newPath, key));
      } else {
        if (item.fun) {
          items.push(<FunctionComponent
            onLog={onLog}
            className="mb-3"
            key={newPath}
            {...item.fun}
            path={newPath}
            name={formatName(key)}
            confirm={key.startsWith("confirm_")}
          />);
        } else {
          items.push(<div key={newPath} className="mb-3 text-red-600">Failed to parse function: &#39;{newPath}&#39;</div>);
        }
      }
    }
    const className = path == "scripts" ? "" : "pl-4 pb-2 mb-2 border-l-2 border-gray-500";
    return <div key={path} className={className}>
      {key && <label className="px-4 inline-block mb-3 border-b border-gray-500 relative left-[-16px]">{formatName(key)}</label>}
      <div className="">{items}</div>
    </div>
  }
  return <div>
    {printGroup(scripts, "scripts", "")}
    <Log log={log} />
  </div>
}