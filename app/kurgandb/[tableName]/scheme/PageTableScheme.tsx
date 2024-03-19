"use client";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";
import { ReactNode, useEffect, useState } from "react";
import { fetchCatch, getAPIMethod, JSONErrorResponse, useErrorResponse } from "@artempoletsky/easyrpc/client";
import type { FAddField, FChangeFieldIndex, FGetScheme, FRemoveField, FRenameField, FToggleTag, RGetSchemePage } from "../../api/methods";
import FieldLabel from "../../comp/FieldLabel";
import { ActionIcon, Button, Select, Tooltip } from "@mantine/core";
import { FieldTag } from "@artempoletsky/kurgandb/globals";

import CreateNewField from "./CreateNewField";
import { ChevronDown, ChevronUp, Trash } from 'tabler-icons-react';
import RequestError from "../../comp/RequestError";
import { API_ENDPOINT } from "../../generated";
import { blinkBoolean } from "../../utils_client";
import { AAddField, ATableOnly } from "../../api/schemas";

const toggleTag = getAPIMethod<FToggleTag>(API_ENDPOINT, "toggleTag");
const removeField = getAPIMethod<FRemoveField>(API_ENDPOINT, "removeField");
const addField = getAPIMethod<FAddField>(API_ENDPOINT, "addField");
const changeFieldIndex = getAPIMethod<FChangeFieldIndex>(API_ENDPOINT, "changeFieldIndex");
const renameField = getAPIMethod<FRenameField>(API_ENDPOINT, "renameField");
const getScheme = getAPIMethod<FGetScheme>(API_ENDPOINT, "getScheme");


type Props = ATableOnly & RGetSchemePage;

const TAGS_AVAILABLE: FieldTag[] = ["index", "unique", "textarea", "heavy", "hidden"];


export default function PageTableScheme({ tableName, scheme: schemeInitial }: Props) {
  const fields: ReactNode[] = [];

  let [scheme, setScheme] = useState<TableScheme>(schemeInitial);

  const [setRequestError, , requestError] = useErrorResponse();
  const [typeCopiedTooltip, setTypeCopiedTooltip] = useState(false);

  const fc = fetchCatch({
    errorCatcher: setRequestError,
    before: () => ({ tableName }),
    then: setScheme,
  });

  const fcToggle = fc.method(toggleTag)
    .before((fieldName: string) => ({
      tableName,
      fieldName,
      tagName: $select(fieldName),
    }));


  const fcRemoveField = fc.method(removeField)
    .confirm(async (fieldName: string) => {
      const delStr = prompt(`Write '${fieldName}' to confirm removing this field`);
      return delStr == fieldName;
    })
    .before((fieldName: string) => ({
      tableName,
      fieldName,
    }));


  const fcRenameField = fc.method(renameField)
    .before((fieldName: string) => {
      const newName = prompt(`Enter the new field name:`);
      if (!newName) return;
      return ({
        tableName,
        fieldName,
        newName,
      })
    });



  function copyDocumentType() {
    if (!scheme) return;
    let res = `type ${tableName} = {\n`;
    for (const field of scheme.fieldsOrderUser) {
      const type = scheme.fields[field];
      let tsType: string = type;
      switch (type) {
        case "date":
          tsType = "Date";
          break;

        case "json":
          tsType = "null | {}";
          break;
      }

      res += `  ${field}: ${tsType}\n`;
    }
    res += `}`;

    navigator.clipboard.writeText(res);
    blinkBoolean(setTypeCopiedTooltip);
  }

  const fcAddField = fc.method(addField)
    .before((args: AAddField) => args);


  function onAddField(args: AAddField) {
    fcAddField.action(args)();
  }

  const fcMoveField = fc.method(changeFieldIndex)
    .before((fieldName: string, direction: number) => {
      if (!scheme) throw new Error("no scheme");

      const newIndex = scheme.fieldsOrderUser.indexOf(fieldName) + direction;
      return {
        fieldName,
        tableName,
        newIndex,
      };
    });


  function $select(fieldName: string) {
    const sel = document.querySelector<HTMLInputElement>(`input[name=tag_select_${fieldName}]`);
    if (!sel) throw new Error(`select ${fieldName} not found`);
    return sel.value as FieldTag;
  }


  let i = 0;
  for (const fieldName of scheme.fieldsOrderUser) {
    const tags = scheme.tags[fieldName] || [];
    const type = scheme.fields[fieldName];

    const tagsType: string[] = tags.slice(0);
    tagsType.unshift(type);

    fields.push(<li className="mb-3" key={fieldName}>
      <FieldLabel fieldName={fieldName} scheme={scheme} onRename={fcRenameField.action()} />
      <div className="flex gap-3">
        <Button onClick={fcToggle.action(fieldName)}>Toggle tag:</Button>
        <Select
          allowDeselect={false}
          name={`tag_select_${fieldName}`}
          defaultValue={TAGS_AVAILABLE[0]} data={TAGS_AVAILABLE.map(k => ({ label: k, value: k }))} />
        <div className="border-l border-stone-800"></div>
        <ActionIcon
          className="p-1.5"
          size={36}
          onClick={fcRemoveField.action(fieldName)}>
          <Trash />
        </ActionIcon>

        <div className="border-l border-stone-800 w-[40px] flex flex-col pl-3">
          <ActionIcon
            disabled={i == 0}
            // className="absolute left-3 top-0"
            size={18}
            onClick={fcMoveField.action(fieldName, -1)}>
            <ChevronUp />
          </ActionIcon>
          <ActionIcon
            disabled={i == scheme.fieldsOrderUser.length - 1}
            // className="absolute left-3 bottom-0"
            size={18}
            onClick={fcMoveField.action(fieldName, 1)}>
            <ChevronDown />
          </ActionIcon>
        </div>



      </div>
    </li>)
    i++;
  }


  return <div><ul>
    {fields}
  </ul>
    <CreateNewField requestError={requestError} onAddField={onAddField} tableName={tableName} />

    <RequestError requestError={requestError} />
    <Tooltip opened={typeCopiedTooltip} label="Copied!">
      <Button onClick={copyDocumentType}>Copy document type</Button>
    </Tooltip>
  </div>
}