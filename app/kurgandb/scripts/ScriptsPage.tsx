"use client";

import { ReactNode, useState } from "react";
import FunctionComponent from "./FunctionComponent";
import Log from "./Log";
import type { ScriptsLogRecord } from "../api/route";
import { formatCamelCase } from "../globals";



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


export default function ScriptsPage({ scripts }: Props) {

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
          items.push(<FunctionComponent onLog={onLog} className="mb-3" key={newPath} {...item.fun} path={newPath} name={formatCamelCase(key)} />);
        } else {
          items.push(<div key={newPath} className="mb-3 text-red-600">Failed to parse function: '{newPath}'</div>);
        }
      }
    }
    return <div key={path} className="pl-4 pb-2 mb-2 border-l-2 border-gray-500">
      {key && <label className="px-4 inline-block mb-3 border-b border-gray-500 relative left-[-16px]">{formatCamelCase(key)}</label>}
      <div className="">{items}</div>
    </div>
  }
  return <div>
    {printGroup(scripts, "scripts", "")}
    <Log log={log} />
  </div>
}