"use client";

import { fetchCatch, useErrorResponse } from "@artempoletsky/easyrpc/react";

import { useEffect, useState } from "react";
import Paginator from "../comp/paginator";
import type { LogEntry } from "@artempoletsky/kurgandb/globals";
import { adminRPC } from "../globals";
import { useStoreEffectSet } from "../store";

const getLog = adminRPC().method("getLog");

type Props = {
  logsList: string[];
};
export default function PageLogs({ logsList }: Props) {
  useStoreEffectSet("tableName", "");

  const [page, setPage] = useState(1);

  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const pageSize = 20;
  const pagesCount = Math.ceil(logsList.length / pageSize);

  const [setErrorResponse, mainErrorMessage] = useErrorResponse();

  const fcOpenLog = fetchCatch(getLog)
    .before((fileName: string) => ({
      fileName,
    }))
    .catch(setErrorResponse)
    .then(setLogEntries);

  const start = (page - 1) * pageSize;
  const pageEntries: string[] = logsList.slice(start, start + pageSize);

  return (
    <div className="">
      <div className="flex gap-3">
        <ul className="sidebar">
          {pageEntries.map(id => <li className="sidebar_li" key={id} onClick={fcOpenLog.action(id)}>{id}</li>)}
        </ul>
        <ul className="overflow-y-scroll h-[675px] w-[750px]">
          {logEntries.map((e, i) =>
            <li key={i}>
              <details>
                <summary>
                  <div className="">
                    {e.time}: {e.level}: {e.message}
                  </div>
                </summary>
                <div className="whitespace-pre">
                  {e.details}
                </div>
              </details>
            </li>
          )}
        </ul>
      </div>
      <div className="text-red-600 min-h-[24px]">{mainErrorMessage}</div>
      <Paginator page={page} pagesCount={pagesCount} onSetPage={setPage} />
    </div>
  );
}