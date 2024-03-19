"use client";

import Paginator from "../../comp/paginator";
import EditDocumentForm from "./EditDocumentForm";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FGetDraft, FGetFreeId, FQueryRecords, FGetScheme, FReadDocument, RQueryRecords, RGetSchemePage } from "../../api/methods";
import { fetchCatch, getAPIMethod, useErrorResponse } from "@artempoletsky/easyrpc/client";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";
import { Button, Textarea } from "@mantine/core";
import RequestError from "../../comp/RequestError";
import { API_ENDPOINT } from "../../generated";
import css from "../../admin.module.css";

import { PlainObject } from "@artempoletsky/kurgandb/globals";
import type { AQueryRecords, ATableOnly } from "../../api/schemas";
import ComponentLoader, { Mutator } from "../../comp/ComponentLoader";
import RecordsList from "./RecordsList";



const readDocument = getAPIMethod<FReadDocument>(API_ENDPOINT, "readDocument");
const queryRecords = "queryRecords" as unknown as FQueryRecords;
// getAPIMethod<FQueryRecords>(API_ENDPOINT, "queryRecords");
const getDraft = getAPIMethod<FGetDraft>(API_ENDPOINT, "getDraft");
const getFreeId = getAPIMethod<FGetFreeId>(API_ENDPOINT, "getFreeId");


type Props = ATableOnly & RGetSchemePage;

function getSchemeProps(scheme?: TableScheme) {
  if (!scheme) {
    return {
      primaryKey: "",
      autoincId: "",
    }
  }
  let primaryKey = Object.keys(scheme.tags).find(id => {
    return scheme.tags[id]?.includes("primary") || false;
  }) || "";
  if (!primaryKey) throw new Error("primary key is undefined");
  let autoincId = scheme.tags[primaryKey].includes("autoinc");

  return {
    primaryKey,
    autoincId,
  };
}

export default function PageEditRecords({ tableName, scheme }: Props) {


  const [record, setRecord] = useState<PlainObject | undefined>(undefined);
  const [currentId, setCurrentId] = useState<string | number | undefined>(undefined);
  const [pageData, setPageData] = useState<RQueryRecords | undefined>(undefined);
  // const [page, setPage] = useState<number>(1);

  const queryDefault = "table.all()";

  const { autoincId, primaryKey } = getSchemeProps(scheme);

  // let [queryString, setQueryString] = useState<string>(queryDefault);

  const queryInput = useRef<HTMLTextAreaElement>(null);
  let [insertMode, setInsertMode] = useState<boolean>(false);

  const [setRequestError, , requestError] = useErrorResponse();

  const fc = fetchCatch({
    before: () => ({ tableName }),
    errorCatcher: setRequestError,
  });

  const fcOpenRecord = fc.method(readDocument)
    .catch(setRequestError)
    .before((id: string | number) => {
      setCurrentId(id);
      return {
        tableName,
        id,
      }
    })
    .then(rec => {
      setInsertMode(false);
      setRecord(rec);
    });


  function openDocument(id: string | number) {
    fcOpenRecord.action(id)();
  }

  const loadPage = useCallback((page: number) => {
    setRequestError();
    setRecord(undefined);
    // setPage(page);

    const queryString = !queryInput.current ? queryDefault : queryInput.current.value;
    if (queryString != queryDefault) {
      window.location.hash = "#q=" + queryString;
    } else {
      window.location.hash = "";
    }

    setQueryArgs({
      page,
      queryString,
      tableName,
    });
    // queryRecords({
    //   page,
    //   queryString,
    //   tableName
    // }).then(setPageData)
    //   .catch(setRequestError);
  }, [tableName, setRequestError])
  // function loadPage() {

  // }
  const fcInsert = fc.method(getDraft)
    .then(draft => {
      setRecord(draft);
      setInsertMode(true);
    });

  function onDocCreated() {
    loadPage(queryArgs.page);
    setRecord(undefined);
  }

  const fcOnDuplicate = fc.method(getFreeId)
    .confirm(async () => {
      if (!autoincId) return true;

      const newDoc = { ...record };
      delete newDoc[primaryKey];
      setRecord(newDoc);
      setInsertMode(true);
      return false;
    })
    .then(newId => {
      setRecord({
        ...record,
        [primaryKey]: newId
      });
      setInsertMode(true);
    });

  useEffect(() => {

    try {
      const locationFull = window.location.hash;
      const decodedURI = decodeURI(locationFull);


      const urlParams = new URLSearchParams(decodedURI.replace("#", "?"));

      const q = urlParams.get("q") || "";
      const userQuery = q && (q);


      if (userQuery && queryInput.current) {
        queryInput.current.innerHTML = userQuery;
        queryInput.current.value = userQuery;
      }
    } catch (err) {
      console.log(err);
    }

    loadPage(1);

  }, [loadPage]);



  function onClose() {
    setRecord(undefined);
  }
  const getInvalidRecordsRequest = `t.filter($.invalid)`;
  const whereRequest = `t.where("${"id"}", "new_id")`;
  const startsWith = `t.where("${"id"}", value => value.startsWith("a"))`;

  function setQuery(string: string) {
    if (!queryInput.current) throw new Error("Error");

    queryInput.current.value = string;
  }

  const [queryArgs, setQueryArgs] = useState<AQueryRecords>({
    page: 1,
    tableName,
    queryString: queryDefault,
  });
  const mutator = new Mutator<RQueryRecords>();
  function onUpdateId(oldId: string | number, newId: string | number) {
    if (!pageData) throw new Error("no page data");

    const iOf = pageData.documents.indexOf(oldId);
    pageData.documents.splice(iOf, 1, newId);
    setCurrentId(newId);
    setRecord({
      ...record,
      [primaryKey]: newId,
    });
    mutator.trigger(pageData);
  }

  return (
    <div>
      <div className="mt-3 mb-1 flex gap-1">
        <div className="">
          <Textarea defaultValue={queryDefault} className="min-w-[500px]" resize="vertical" ref={queryInput} />
          <div className="flex gap-3 mt-2">
            <i onClick={e => setQuery(queryDefault)}
              className={css.pseudo}>All</i>
            <i onClick={e => setQuery(whereRequest)}
              className={css.pseudo}>Where</i>
            <i onClick={e => setQuery(startsWith)}
              className={css.pseudo}>Stars with</i>
            <i onClick={e => setQuery(getInvalidRecordsRequest)}
              className={css.pseudo}>Invalid</i>
          </div>
        </div>
        <Button className="align-top" onClick={e => loadPage(1)}>Select</Button>
        <div className="border-l border-gray-500 mx-3 h-[34px]"></div>
        <Button className="align-top" onClick={fcInsert.action()}>New record</Button>
        <div className="grow ml-3">
          <RequestError requestError={requestError} />
        </div>
      </div>
      <div className="">
        <div className="flex">
          <ComponentLoader
            Component={RecordsList}
            method={queryRecords}
            args={queryArgs}
            onData={setPageData}
            props={{
              onRecordSelect: openDocument
            }}
            mutator={mutator}
          />
          {/* <ul className={css.sidebar}>
              {pageData.documents.map(id => <li className={css.item} key={id} onClick={fcOpenRecord.action(id)}>{id}</li>)}
            </ul> */}
          {scheme && record && <EditDocumentForm
            primaryKey={primaryKey}
            onUpdateId={onUpdateId}
            onClose={onClose}
            insertMode={insertMode}
            recordId={currentId}
            tableName={tableName}
            scheme={scheme}
            record={record}
            onDeleted={onDocCreated}
            onCreated={onDocCreated}
            onDuplicate={fcOnDuplicate.action()}
            onRequestError={setRequestError}
          />}
        </div>
        {pageData && <Paginator page={queryArgs.page} pagesCount={pageData.pagesCount} onSetPage={loadPage}></Paginator>}
      </div>

    </div>

  );
}