"use client";
import type { TableScheme } from "@artempoletsky/kurgandb/globals";

// import Button from "./Button";
import { ReactNode, useEffect, useRef, useState } from "react";
import { RequestErrorSetter } from "@artempoletsky/easyrpc/client";

import FieldLabel from "../../comp/FieldLabel";
import { ActionIcon, Button, Checkbox, CloseButton, Menu, MenuTarget, Modal, TextInput, Textarea, Tooltip } from "@mantine/core";
import { API_ENDPOINT } from "../../generated";
import { blinkBoolean } from "../../utils_client";
import { FieldTag, FieldType, PlainObject } from "@artempoletsky/kurgandb/globals";

import { fieldScripts } from "../../../kurgandb_admin/field_scripts";
import { ScriptsRecord, adminRPC } from "../../globals";
import CustomComponentRecord from "../../../kurgandb_admin/components/CustomComponentRecord";
import { Calendar, Dots, Edit } from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";
import { DatePicker, DateValue } from "@mantine/dates";
import EditJSON from "./EditJSON";
import EditFormField from "./EditFormField";
import { fetchCatch } from "@artempoletsky/easyrpc/react";

const {
  updateDocument,
  createDocument,
  deleteDocument,
} = adminRPC().methods("updateDocument", "createDocument", "deleteDocument");

type Props = {
  record: PlainObject;
  scheme: TableScheme;
  insertMode?: boolean;
  tableName: string;
  recordId: string | number | undefined;
  onCreated: (id: string | number) => void;
  onDeleted: () => void;
  onDuplicate: () => void;
  onRequestError: RequestErrorSetter;
  onClose: () => void;
  onUpdateId: (oldId: string | number, newId: string | number) => void;
  primaryKey: string;
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
  onClose,
  onUpdateId,
  primaryKey,
}: Props) {

  const form = useRef<HTMLFormElement>(null);
  const [record, setRecord] = useState<PlainObject>(initialRecord);
  const proxy = createProxy(record, setRecord);
  const [editJSONModalOpened, disclosureJSON] = useDisclosure(false);
  const [editingJSON, setEditingJSON] = useState("");

  const fc = fetchCatch().catch(onRequestError);

  function onJSONEdit(fieldName: string) {
    setEditingJSON(fieldName);
    disclosureJSON.open();
  }
  function reset() {
    setRecord({
      ...initialRecord,
    });
  }

  function save() {

    if (recordId === undefined) throw new Error("id is undefined");
    const oldRecordId = recordId;
    updateDocument({
      id: oldRecordId,
      tableName,
      document: record
    }).then(() => {
      blinkBoolean(setSavedTooltip);
      if (recordId != record[primaryKey]) {
        console.log(recordId, record[primaryKey]);

        onUpdateId(recordId, record[primaryKey]);
      }
    })
      .catch(onRequestError);
  }

  const create = fc.method(createDocument).before(() => ({
    tableName,
    document: record,
  })).then(onCreated).action();

  const remove = fc.method(deleteDocument).before(() => {
    if (recordId === undefined) throw new Error("id is undefined");
    return {
      tableName,
      id: recordId,
    }
  }).confirm(async () => {
    return confirm("Are you sure you want delete this document?");
  }).then(onDeleted).action();

  const currentFieldScripts = fieldScripts[tableName] || {};

  useEffect(() => {
    setRecord(initialRecord);
  }, [recordId, scheme, initialRecord]);

  const fields: ReactNode[] = [];
  for (const fieldName of scheme.fieldsOrderUser) {
    const type = scheme.fields[fieldName];
    const tags = new Set(scheme.tags[fieldName]);
    if (tags.has("autoinc") && insertMode) continue;

    // if (record[fieldName] === undefined) debugger;
    fields.push(<div className="mr-1" key={fieldName}>
      <FieldLabel queryFilter={record[fieldName]} fieldName={fieldName} scheme={scheme} />
      {<EditFormField
        proxy={proxy}
        fieldName={fieldName}
        value={proxy[fieldName]}
        tags={tags}
        type={type}
        onJSONEdit={onJSONEdit}
        scriptsObject={currentFieldScripts[fieldName]}
        onChange={value => proxy[fieldName] = value}
      />}
    </div>);
  }
  <TextInput

    id="standard-error-helper-text"

    defaultValue="Hello World"

  />
  const [savedTooltip, setSavedTooltip] = useState(false);


  return <div className="pl-5 flex gap-3 grow" onKeyDown={e => {
    if (e.ctrlKey && e.key == "s") {
      e.preventDefault();
      e.stopPropagation();
      save();
    }
  }}>
    <div className="min-w-[500px] relative pt-5">
      <div className="absolute right-0 top-0">
        <CloseButton onClick={onClose} />
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
          <Button onClick={reset}>Reset</Button>
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