"use client";
import type { TableScheme } from "@artempoletsky/kurgandb/table";

// import Button from "./Button";
import { ReactNode, useEffect, useRef, useState } from "react";
import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { FCreateDocument, FDeleteDocument, FUpdateDocument } from "../api/methods";

import FieldLabel from "../comp/FieldLabel";
import { ActionIcon, Button, Checkbox, CloseButton, Menu, MenuTarget, Modal, TextInput, Textarea, Tooltip } from "@mantine/core";
import { API_ENDPOINT } from "../generated";
import { blinkBoolean } from "../utils_client";
import { $, FieldTag, FieldType, PlainObject } from "@artempoletsky/kurgandb/globals";
import { JSONErrorResponse } from "@artempoletsky/easyrpc/client";

import { fieldScripts } from "../../kurgandb_admin/field_scripts";
import { ScriptsRecord, formatCamelCase } from "../globals";
import CustomComponentRecord from "../../kurgandb_admin/components/CustomComponentRecord";
import { Calendar, Dots, Edit } from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";
import { DateInput, DatePicker, DateTimePicker, DateValue } from "@mantine/dates";
import EditJSON from "./EditJSON";

const updateDocument = getAPIMethod<FUpdateDocument>(API_ENDPOINT, "updateDocument");
const createDocument = getAPIMethod<FCreateDocument>(API_ENDPOINT, "createDocument");
const deleteDocument = getAPIMethod<FDeleteDocument>(API_ENDPOINT, "deleteDocument");


type Props = {
  record: PlainObject
  scheme: TableScheme
  insertMode?: boolean
  tableName: string
  recordId: string | number | undefined
  onCreated: (id: string | number) => void
  onDeleted: () => void
  onDuplicate: () => void
  onRequestError: (e: JSONErrorResponse) => void
  onClose: () => void
};

function createProxy<T>(record: T, setRecord: (newRecord: T) => void): T {
  return new Proxy<any>(record, {
    set(target, key, value) {
      target[key] = value;
      setRecord({
        ...target
      });
      return true;
    },
    get(target, key) {
      return target[key];
    }
  });
}



export default function EditDocumentForm({
  onDeleted,
  recordId,
  record: initialRecord,
  scheme,
  insertMode,
  tableName,
  onCreated,
  onDuplicate,
  onRequestError,
  onClose
}: Props) {

  const form = useRef<HTMLFormElement>(null);
  const [record, setRecord] = useState<PlainObject>({});
  const proxy = createProxy(record, setRecord);
  const [editJSONModalOpened, disclosureJSON] = useDisclosure(false);
  const [editingJSON, setEditingJSON] = useState("");


  function onChange(fieldName: string) {
    return (e: any) => {
      proxy[fieldName] = e.target.value;
    }
  }

  function save() {

    if (recordId === undefined) throw new Error("id is undefined");

    updateDocument({
      id: recordId,
      tableName,
      document: record
    }).then(() => blinkBoolean(setSavedTooltip))
      .catch(onRequestError);
  }

  function create() {
    createDocument({ tableName, document: record })
      .then(onCreated)
      .catch(onRequestError);
  }

  function remove() {
    if (recordId === undefined) throw new Error("id is undefined");

    if (!confirm("Are you sure you want delete this document?")) return;
    deleteDocument({ tableName, id: recordId })
      .then(onDeleted)
      .catch(onRequestError);
  }

  const currentFieldScripts = fieldScripts[tableName] || {};
  // const formTextDefaults: Record<string, any> = {};
  // for (const fieldName of scheme.fieldsOrderUser) {
  //   let value: any = "";
  //   const type = scheme.fields[fieldName];
  //   if (type == "json") {
  //     value = JSON.stringify(value, null, 0);
  //   } else if (type == "boolean") {
  //     value = false;
  //   }
  //   formTextDefaults[fieldName] = value;
  // }
  function updateDateInput(fieldName: string) {
    if (!form.current) throw new Error("no form ref");
    const input = form.current.querySelector<HTMLInputElement>(`[name=${fieldName}]`);
    if (input) {
      input.value = record[fieldName].toUTCString();
    }
  }

  useEffect(() => {
    if (!form.current) throw new Error("no form ref");
    const rec: PlainObject = {};
    for (const fieldName in scheme.fields) {
      const type = scheme.fields[fieldName];

      if (type == "date") {
        const date = new Date(initialRecord[fieldName]);
        rec[fieldName] = date;
        const input = form.current.querySelector<HTMLInputElement>(`[name=${fieldName}]`);
        if (input) {
          input.value = date.toUTCString();
        }
      } else {
        rec[fieldName] = initialRecord[fieldName];
      }
    }

    setRecord(rec);
  }, [recordId, scheme, initialRecord]);

  function printScripts(scripts: ScriptsRecord, fieldName: string) {

    const scriptNames: Record<string, string> = {};
    for (const key in scripts) {
      scriptNames[key] = formatCamelCase(key);
    }
    const scriptKeys = Object.keys(scriptNames);


    if (scriptKeys.length == 0) {
      return "";
    }

    function onScriptTrigger(key: string) {

      if (!form.current) throw new Error("no form ref");
      const input = form.current.querySelector<HTMLInputElement>(`[name=${fieldName}]`);
      if (!input) throw new Error("input not found");
      scripts[key](proxy);
    }
    if (scriptKeys.length == 1) {
      const key = scriptKeys[0];
      return <Button onClick={e => onScriptTrigger(key)} className="shrink">{scriptNames[key]}</Button>
    }

    return <Menu>
      <Menu.Target>
        <ActionIcon size={36}><Dots /></ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {scriptKeys.map(key => <Menu.Item onClick={e => onScriptTrigger(key)} key={key}>{scriptNames[key]}</Menu.Item>)}
      </Menu.Dropdown>
    </Menu>
  }

  function onDateChange(fieldName: string) {
    return (d: DateValue) => {
      if (!d) return;
      const date: Date = record[fieldName];
      // console.log(d.getSeconds());

      // date.setDate(d.getDate());
      date.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
      // console.log(d);

      proxy[fieldName] = date;
      updateDateInput(fieldName)
    }
  }
  function printField(fieldName: string, type: FieldType, tags: Set<FieldTag>): ReactNode {
    if (record[fieldName] === undefined) return "";
    if (type == "json") {
      return <div className="flex"><div className="grow break-words overflow-hidden overflow-ellipsis max-w-[462px] max-h-[50px]">{JSON.stringify(record[fieldName])}</div>
        <ActionIcon onClick={e => {
          setEditingJSON(fieldName);
          disclosureJSON.open();
        }} size={32}><Edit /></ActionIcon>
      </div>
    }
    if (type == "date") {
      // const value = (record[fieldName] as Date).toUTCString();
      return <div className="flex gap-3">
        <Menu>
          <Menu.Target>
            <ActionIcon size={36}><Calendar /></ActionIcon>
          </Menu.Target>
          <Menu.Dropdown >
            <DatePicker defaultDate={record[fieldName]} value={record[fieldName]} onChange={onDateChange(fieldName)} />
          </Menu.Dropdown>
        </Menu>
        <div className="grow"><TextInput
          name={fieldName}
          defaultValue={record[fieldName].toUTCString()}
          onBlur={e => {
            const d = new Date(e.target.value);

            if (!isNaN(d as any)) {
              proxy[fieldName] = d;
            }
            updateDateInput(fieldName);
          }} autoComplete="off" size="sm" /></div>

      </div>

      // return <DateInput
      //   defaultDate={record[fieldName]}
      //   name={fieldName}
      //   valueFormat="DD/MM/YYYY HH:mm:ss"
      // />
    }
    if (tags.has("textarea")) return <Textarea resize="both" name={fieldName} value={record[fieldName]} onChange={onChange(fieldName)} />;

    if (type == "boolean") {
      return <Checkbox checked={record[fieldName]} onChange={e => proxy[fieldName] = e.target.checked} name={fieldName} />
    }

    return <TextInput value={record[fieldName]} onChange={onChange(fieldName)} autoComplete="off" size="sm" variant="default" type="text" name={fieldName} />;
  }

  function printFieldScripts(fieldName: string, type: FieldType, tags: Set<FieldTag>): ReactNode {
    const scriptsObject = currentFieldScripts[fieldName];
    if (scriptsObject) {
      return <div className="flex gap-3">
        <div className="grow">
          {printField(fieldName, type, tags)}
        </div>
        <div className="shrink">
          {printScripts(scriptsObject, fieldName)}
        </div>
      </div>
    }
    return printField(fieldName, type, tags);
  }

  const fields: ReactNode[] = [];
  for (const fieldName of scheme.fieldsOrderUser) {
    const type = scheme.fields[fieldName];
    const tags = new Set(scheme.tags[fieldName] || []);
    if (tags.has("autoinc") && insertMode) continue;


    fields.push(<div className="mr-1" key={fieldName}>
      <FieldLabel fieldName={fieldName} scheme={scheme} />
      {printFieldScripts(fieldName, type, tags)}
    </div>);
  }
  <TextInput

    id="standard-error-helper-text"

    defaultValue="Hello World"

  />
  const [savedTooltip, setSavedTooltip] = useState(false);


  return <div className="pl-5 flex gap-3 grow">
    <div className="min-w-[500px] relative pt-5">
      <div className="absolute right-0 top-0">
        <CloseButton onClick={onClose} />
        {/* <ActionIcon className="" size="md"></ActionIcon> */}
      </div>
      <form className="mb-5" ref={form}>{fields}</form>
      {insertMode
        ? <div><Button onClick={create}>Create</Button></div>
        : <div className="flex gap-1">
          <Tooltip opened={savedTooltip} label="Saved!">
            <Button onClick={save}>Save</Button>
          </Tooltip>
          <Button onClick={remove}>Remove</Button>
          <Button onClick={onDuplicate}>Duplicate</Button>
        </div>
      }
    </div>
    <div className="grow">
      <CustomComponentRecord
        onRequestError={onRequestError}
        tableName={tableName}
        record={proxy as any}
        recordId={recordId}
      />
    </div>
    <Modal title="Edit JSON field" opened={editJSONModalOpened} onClose={disclosureJSON.close} size={750}>
      <EditJSON close={disclosureJSON.close} fieldName={editingJSON} record={proxy} />
    </Modal>
  </div>
}