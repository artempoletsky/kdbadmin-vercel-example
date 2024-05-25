"use client";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";
import { ReactNode, useState } from "react";
import { useErrorResponse, fetchCatch } from "@artempoletsky/easyrpc/react";
import type { RGetSchemePage } from "../../api/methods";
import FieldLabel from "../../comp/FieldLabel";
import { ActionIcon, Button, Select, Tooltip } from "@mantine/core";
import { FieldTag } from "@artempoletsky/kurgandb/globals";

import CreateNewField from "./CreateNewField";
import { ChevronDown, ChevronUp, Trash } from 'tabler-icons-react';
import RequestError from "../../comp/RequestError";
import { AAddField, ATableOnly } from "../../api/schemas";
import { generateCreateTable, generateRecordTypesFromScheme } from "./generateType";
import Code from "../../comp/Code";
import { adminRPC } from "../../globals";

const {
  toggleTag,
  removeField,
  addField,
  changeFieldIndex,
  renameField,
  getScheme,
} = adminRPC().methods("toggleTag", "removeField", "addField", "changeFieldIndex", "renameField", "getScheme");


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
    .before((fieldName: string) => ({
      tableName,
      fieldName,
    }))
    .confirm(async (fieldName: string) => {
      const delStr = prompt(`Write '${fieldName}' to confirm removing this field`);
      return delStr == fieldName;
    })


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

  const declarationCode = generateRecordTypesFromScheme(scheme, tableName);
  const createTableCode = generateCreateTable(scheme, tableName);

  const fcAddField = fc.method(addField)
    .before((args: AAddField) => args);


  function onAddField(args: AAddField) {
    fcAddField.action(args)();
  }

  const fcMoveField = fc.method(changeFieldIndex)
    .before<{ fieldName: string, direction: number }>(({ fieldName, direction }) => {
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
      <FieldLabel fieldName={fieldName} scheme={scheme} onRename={fcRenameField.action(fieldName)} />
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
            onClick={fcMoveField.action({ fieldName, direction: -1 })}>
            <ChevronUp />
          </ActionIcon>
          <ActionIcon
            disabled={i == scheme.fieldsOrderUser.length - 1}
            // className="absolute left-3 bottom-0"
            size={18}
            onClick={fcMoveField.action({ fieldName, direction: 1 })}>
            <ChevronDown />
          </ActionIcon>
        </div>



      </div>
    </li>)
    i++;
  }


  return <div>
    <div className="flex">
      <ul>
        {fields}
      </ul>
      <div className="">
        <CreateNewField requestError={requestError} onAddField={onAddField} tableName={tableName} />
        <RequestError requestError={requestError} />
      </div>
      <div className="">
        <p className="mb-1">Record types declaration:</p>
        <Code size="sm" code={declarationCode} />
        <p className="mb-1">Create table:</p>
        <Code size="sm" code={createTableCode} />
      </div>
    </div>

  </div>
}