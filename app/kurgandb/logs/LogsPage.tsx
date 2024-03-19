"use client";

import css from "../admin.module.css";
import { fetchCatch, getAPIMethod, useErrorResponse } from "@artempoletsky/easyrpc/client";

import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../generated";
import type { FGetLog } from "../api/methods";
import Paginator from "../comp/paginator";
import type { LogEntry } from "@artempoletsky/kurgandb/globals";
import { before } from "node:test";

const getLog = getAPIMethod<FGetLog>(API_ENDPOINT, "getLog");


type Props = {
  logsList: string[];
};
export default function TestComponent({ logsList }: Props) {

  const [pageEntries, setPageEntries] = useState<string[]>([])
  const [page, setPage] = useState(1);

  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const pageSize = 20;
  const pagesCount = Math.ceil(logsList.length / pageSize);

  const [setErrorResponse, mainErrorMessage] = useErrorResponse();

  const fcOpenLog = fetchCatch(getLog)
    .before(fileName => ({
      fileName,
    }))
    .catch(setErrorResponse)
    .then(setLogEntries);

  function showPage(num: number) {
    setPage(num);
    const start = (num - 1) * pageSize;
    setPageEntries(logsList.slice(start, start + pageSize));
  }

  useEffect(() => {
    showPage(1);
  }, []);

  return (
    <div className="">
      <div className="flex gap-3">
        <ul className={css.sidebar}>
          {pageEntries.map(id => <li className={css.sidebar_li} key={id} onClick={fcOpenLog.action(id)}>{id}</li>)}
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
      <Paginator page={page} pagesCount={pagesCount} onSetPage={showPage} />
    </div>
  );
}