"use client";

import Paginator from "../../comp/paginator";
import EditDocumentForm from "./EditDocumentForm";
import { useEffect, useState } from "react";
import type { RQueryRecords, RGetSchemePage } from "../../api/methods";

import type { TableScheme } from "@artempoletsky/kurgandb/globals";
import { Button, Textarea } from "@mantine/core";
import RequestError from "../../comp/RequestError";

import { PlainObject } from "@artempoletsky/kurgandb/globals";
import type { AQueryRecords, ATableOnly } from "../../api/schemas";
import ComponentLoader, { Mutator } from "../../comp/ComponentLoader";
import RecordsList from "./RecordsList";
import { fetchCatch, useErrorResponse } from "@artempoletsky/easyrpc/react";
import { adminRPC } from "../../globals";
import { useStore } from "../../store";


const {
  readDocument,
  // queryRecords,
  getDraft,
  getFreeId,
} = adminRPC().methods("readDocument", "queryRecords", "getDraft", "getFreeId");

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
  // Store.setBreadcrumbs([
  //   { href: "/", title: "Tables" },
  //   { href: "", title: tableName },
  // ]);

  const [record, setRecord] = useState<PlainObject | undefined>(undefined);
  const [currentId, setCurrentId] = useState<string | number | undefined>(undefined);
  const [pageData, setPageData] = useState<RQueryRecords | undefined>(undefined);
  // const [page, setPage] = useState<number>(1);


  const queryDefault = "table.all()";
  const [queryString, setQueryString] = useStore("queryString");

  const { autoincId, primaryKey } = getSchemeProps(scheme);

  // let [queryString, setQueryString] = useState<string>(queryDefault);

  // const queryInput = useRef<HTMLTextAreaElement>(null);
  let [insertMode, setInsertMode] = useState<boolean>(false);

  // const [setRequestError, , requestError] = useErrorResponse();

  const fc = fetchCatch({
    before: () => ({ tableName }),
  });

  const { errorSetter: setRequestError, errorResponse } = fc.useCatch();

  const fcOpenRecord = fc.method(readDocument)
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

  const loadPage = (page: number) => {
    setRequestError();
    setRecord(undefined);
    // setPage(page);

    // const queryString = !queryInput.current ? queryDefault : queryInput.current.value;

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
  };
  // function loadPage() {

  // }
  const fcInsert = fc.method(getDraft)
    .then(draft => {
      setRecord(draft);
      setInsertMode(true);
    });

  function onDocDeleted() {
    loadPage(queryArgs!.page);
    setRecord(undefined);
  }

  function onDocCreated(id: string | number) {
    // loadPage(queryArgs!.page);
    const idStr = typeof id == "string" ? `"${id}"` : id + "";
    const queryString = `t.where("${primaryKey}", ${idStr})`;
    setQueryString(queryString)
    setQueryArgs({
      page: 1,
      tableName,
      queryString,
    });
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


      if (userQuery) {
        setQueryString(userQuery);
        setQueryArgs({
          page: 1,
          queryString: userQuery,
          tableName,
        });
      } else {
        setQueryString(queryDefault);
        setQueryArgs({
          page: 1,
          queryString: queryDefault,
          tableName,
        });
      }
    } catch (err) {
      console.log(err);
    }


  }, [tableName]);

  function onClose() {
    setCurrentId(undefined);
    setRecord(undefined);
  }
  const getInvalidRecordsRequest = `t.filter($.invalid)`;
  const whereRequest = `t.where("${"id"}", "new_id")`;
  const startsWith = `t.where("${"id"}", value => value.startsWith("a"))`;


  const [queryArgs, setQueryArgs] = useState<AQueryRecords | null>(null);
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
          <Textarea value={queryString}
            onChange={e => setQueryString(e.target.value)}
            className="min-w-[500px]"
            resize="vertical"
          />
          <div className="flex gap-3 mt-2">
            <i onClick={e => setQueryString(queryDefault)}
              className="pseudo">All</i>
            <i onClick={e => setQueryString(startsWith)}
              className="pseudo">Stars with</i>
            <i onClick={e => setQueryString(getInvalidRecordsRequest)}
              className="pseudo">Invalid</i>
          </div>
        </div>
        <Button className="align-top" onClick={e => loadPage(1)}>Select</Button>
        <div className="border-l border-gray-500 mx-3 h-[34px]"></div>
        <Button className="align-top" onClick={fcInsert.action()}>New record</Button>
        <div className="grow ml-3">
          <RequestError requestError={errorResponse} />
        </div>
      </div>
      <div className="">
        <div className="flex">
          <ComponentLoader
            Component={RecordsList}
            method={adminRPC().hack("queryRecords")}
            args={queryArgs}
            onData={setPageData}
            props={{
              current: currentId,
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
            onDeleted={onDocDeleted}
            onCreated={onDocCreated}
            onDuplicate={fcOnDuplicate.action()}
            onRequestError={setRequestError}
          />}
        </div>
        {pageData && <Paginator page={queryArgs!.page} pagesCount={pageData.pagesCount} onSetPage={loadPage}></Paginator>}
      </div>

    </div>

  );
}