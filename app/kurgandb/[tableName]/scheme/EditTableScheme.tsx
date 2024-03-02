"use client";
import type { TableScheme } from "@artempoletsky/kurgandb/table";
import { ReactNode, useState } from "react";
import { getAPIMethod, JSONErrorResponse } from "@artempoletsky/easyrpc/client";
import type { FAddField, FChangeFieldIndex, FRemoveField, FRenameField, FToggleTag } from "../../api/route";
import FieldLabel from "../../comp/FieldLabel";
import { ActionIcon, Button, Select, Tooltip } from "@mantine/core";
import { FieldTag } from "@artempoletsky/kurgandb/globals";

import CreateNewField from "./CreateNewField";
import { ChevronDown, ChevronUp, Trash } from 'tabler-icons-react';
import RequestError from "../../comp/RequestError";
import { API_ENDPOINT } from "../../generated";
import { blinkBoolean } from "../../utils_client";
import { AAddField } from "../../api/schemas";

const toggleTag = getAPIMethod<FToggleTag>(API_ENDPOINT, "toggleTag");
const removeField = getAPIMethod<FRemoveField>(API_ENDPOINT, "removeField");
const addField = getAPIMethod<FAddField>(API_ENDPOINT, "addField");
const changeFieldIndex = getAPIMethod<FChangeFieldIndex>(API_ENDPOINT, "changeFieldIndex");
const renameField = getAPIMethod<FRenameField>(API_ENDPOINT, "renameField");

type Props = {
  tableName: string
  scheme: TableScheme
}

const TAGS_AVAILABLE: FieldTag[] = ["index", "unique", "textarea", "heavy", "hidden"];


export default function EditTableScheme({ tableName, scheme: schemeInitial }: Props) {
  const fields: ReactNode[] = [];

  let [scheme, setScheme] = useState(schemeInitial);

  let [requestError, setRequestError] = useState<JSONErrorResponse | undefined>(undefined);
  const [typeCopiedTooltip, setTypeCopiedTooltip] = useState(false);

  function toggleHandler(fieldName: string, tagName: FieldTag) {
    setRequestError(undefined);
    toggleTag({
      tableName,
      fieldName,
      tagName,
    }).then(setScheme)
      .catch(setRequestError);
  }

  function confirmRemoveField(fieldName: string) {
    const delStr = prompt(`Write '${fieldName}' to confirm removing this field`);
    if (delStr != fieldName) return;
    setRequestError(undefined);
    removeField({
      tableName,
      fieldName,
    }).then(setScheme)
      .catch(setRequestError);
  }

  function promptRenameField(fieldName: string) {
    const newName = prompt(`Enter the new field name:`);
    if (!newName) return;

    setRequestError(undefined);
    renameField({
      tableName,
      fieldName,
      newName,
    }).then(setScheme)
      .catch(setRequestError);
  }

  function copyDocumentType() {
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


  function onAddField(args: AAddField) {
    setRequestError(undefined);

    addField(args)
      .then(setScheme)
      .catch(setRequestError);
  }

  function moveField(fieldName: string, direction: number) {
    const newIndex = scheme.fieldsOrderUser.indexOf(fieldName) + direction;
    changeFieldIndex({
      fieldName,
      tableName,
      newIndex,
    })
      .then(setScheme)
      .catch(setRequestError);
  }

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
      <FieldLabel fieldName={fieldName} scheme={scheme} onRename={promptRenameField} />
      <div className="flex gap-3">
        <Button onClick={e => toggleHandler(fieldName, $select(fieldName))}>Toggle tag:</Button>
        <Select
          allowDeselect={false}
          name={`tag_select_${fieldName}`}
          defaultValue={TAGS_AVAILABLE[0]} data={TAGS_AVAILABLE.map(k => ({ label: k, value: k }))} />
        <div className="border-l border-stone-800"></div>
        <ActionIcon
          className="p-1.5"
          size={36}
          onClick={e => confirmRemoveField(fieldName)}>
          <Trash />
        </ActionIcon>
        
        <div className="border-l border-stone-800 w-[40px] flex flex-col pl-3">
          <ActionIcon
            disabled={i == 0}
            // className="absolute left-3 top-0"
            size={18}
            onClick={e => moveField(fieldName, -1)}>
            <ChevronUp />
          </ActionIcon>
          <ActionIcon
            disabled={i == scheme.fieldsOrderUser.length - 1}
            // className="absolute left-3 bottom-0"
            size={18}
            onClick={e => moveField(fieldName, 1)}>
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