"use client";

import Paginator from "../comp/paginator";
import EditDocumentForm from "./EditDocumentForm";
import { useEffect, useState } from "react";
import type { FGetDraft, FGetFreeId, FGetPage, FGetScheme, FReadDocument, FRemoveTable, RGetPage } from "../api/route";
import { ValidationErrorResponse, getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { TableScheme } from "@artempoletsky/kurgandb/table";
import { Button, Textarea } from "@mantine/core";
import RequestError from "../comp/RequestError";
import { API_ENDPOINT } from "../generated";

import TableMenu from "../comp/TableMenu";
import { PlainObject } from "@artempoletsky/kurgandb/globals";




const readDocument = getAPIMethod<FReadDocument>(API_ENDPOINT, "readDocument");
const getPage = getAPIMethod<FGetPage>(API_ENDPOINT, "getPage");
const getDraft = getAPIMethod<FGetDraft>(API_ENDPOINT, "getDraft");
const getFreeId = getAPIMethod<FGetFreeId>(API_ENDPOINT, "getFreeId");


type Props = {
  tableName: string
  page?: number
  scheme: TableScheme
}


export default function ({ tableName, scheme }: Props) {


  let [record, setRecord] = useState<PlainObject | undefined>(undefined);
  let [currentId, setCurrentId] = useState<string | number | undefined>(undefined);
  let [pageData, setPageData] = useState<RGetPage | undefined>(undefined);
  let [page, setPage] = useState<number>(1);
  let [queryString, setQueryString] = useState<string>("table.all()");
  let [insertMode, setInsertMode] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<ValidationErrorResponse | undefined>(undefined);


  let primaryKey = Object.keys(scheme.tags).find(id => {
    return scheme.tags[id]?.includes("primary") || false;
  }) || "";
  if (!primaryKey) throw new Error("primary key is undefined");
  let autoincId = scheme.tags[primaryKey].includes("autoinc");

  function openRecord(id: string | number) {
    setRequestError(undefined);
    setCurrentId(id);
    readDocument({
      tableName,
      id
    }).then(rec => {
      setRecord(rec);
      setInsertMode(false);
    })
      .catch(setRequestError);
  }

  function loadPage(page: number) {
    setRequestError(undefined);
    setRecord(undefined);
    setPage(page);
    getPage({
      page,
      queryString,
      tableName
    }).then(setPageData)
      .catch(setRequestError);
  }

  function insert() {
    // setInsertMode(true);
    setRequestError(undefined);
    getDraft({ tableName })
      .then((draft) => {
        setRecord(draft);
        setInsertMode(true);
      })
      .catch(setRequestError);
  }

  function onDocCreated() {
    loadPage(page);
    setRecord(undefined);
  }

  function onDuplicate() {
    if (autoincId) {
      const newDoc = { ...record };
      delete newDoc[primaryKey];
      setRecord(newDoc);
      setInsertMode(true);
      return;
    }
    setRequestError(undefined);
    getFreeId({ tableName })
      .then(newId => {
        setRecord({
          ...record,
          [primaryKey]: newId
        });
        setInsertMode(true);
      })
      .catch(setRequestError);
  }


  useEffect(() => {
    loadPage(1);
  }, []);

  if (!pageData) {
    return <div>Loading...</div>;
  }


  function onClose() {
    setRecord(undefined);
  }
  return (
    <div>
      <div className="mt-3 mb-1 flex gap-1">
        <Textarea className="min-w-[500px]" resize="vertical" value={queryString} onChange={e => setQueryString(e.target.value)} />
        <Button className="align-top" onClick={e => loadPage(1)}>Select</Button>
        <div className="border-l border-gray-500 mx-3 h-[34px]"></div>
        <Button className="align-top" onClick={insert}>New record</Button>
      </div>
      <div className="flex">
        <ul className="mt-3 flex-shrink pr-3 border-r border-stone-600 border-solid min-w-[350px] min-h-[675px]">
          {pageData.documents.map(id => <li className="cursor-pointer py-1 border-b border-gray-500" key={id} onClick={e => openRecord(id)}>{id}</li>)}
        </ul>
        {scheme && record && <EditDocumentForm
          onClose={onClose}
          insertMode={insertMode}
          recordId={currentId}
          tableName={tableName}
          scheme={scheme}
          record={record}
          onDeleted={onDocCreated}
          onCreated={onDocCreated}
          onDuplicate={onDuplicate}
          onRequestError={setRequestError}
        />}
      </div>
      <Paginator page={page} pagesCount={pageData.pagesCount} onSetPage={loadPage}></Paginator>
      <RequestError requestError={requestError} />
    </div>

  );
}