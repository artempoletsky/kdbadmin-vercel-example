"use client";

import { Button, Checkbox, Select, Tooltip } from "@mantine/core";
import TextInput from "./TextInput";
import { getAPIMethod, useErrorResponse } from "@artempoletsky/easyrpc/client";
import type { FCreateTable } from "../api/methods";
import { useState } from "react";
import CheckboxTooltip from "./CheckboxTooltip";
import RequestError from "./RequestError";
import { API_ENDPOINT } from "../generated";
import { useForm, zodResolver } from "@mantine/form";
import { ACreateTable, createTable as ZCreateTable } from "../api/schemas";

const createTable = getAPIMethod<FCreateTable>(API_ENDPOINT, "createTable");


export default function CreateNewTable() {

  const form = useForm<ACreateTable>({
    initialValues: {
      tableName: "",
      keyType: "number",
      autoIncrement: true,
    },
    validate: zodResolver(ZCreateTable)
  });

  const [setErrorResponse, mainErrorMessage, errorResponse] = useErrorResponse(form);

  let [keyType, setKeyType] = useState<"string" | "number">("number");


  function onCreateTable({ tableName, autoIncrement }: ACreateTable) {
    setErrorResponse();
    if (keyType == "string") {
      autoIncrement = false;
    }
    
    tableName = tableName.trim();
    createTable({
      tableName,
      keyType,
      autoIncrement,
    })
      .then(() => {
        window.location.href += "/" + tableName + "/scheme";
      })
      .catch(setErrorResponse)
  }

  return <div className="pl-5 w-[350px]">
    <p className="mb-1">Create a new table:</p>
    <form className="" onSubmit={form.onSubmit(onCreateTable)}>
      <div className="">
        <TextInput
          {...form.getInputProps("tableName")}
          placeholder="table name"
        />
      </div>
      <div className="">
        <Select
          // {...form.getInputProps("keyType")}
          allowDeselect={false}
          name="keyType"
          label="ID type"
          value={keyType}
          data={["string", "number"]}
          onChange={e => setKeyType(e as any)}
        />
      </div>
      {keyType == "number" &&
        <div className="mb-2">
          <CheckboxTooltip
            {...form.getInputProps("autoIncrement", {
              type: "checkbox"
            })}
            // onChange={setAutoIncrement}
            // value={autoIncrement}
            tooltip="Uncheck if you want to manage ID generation manually"
            label="auto increment"
          />
        </div>}
      <div className="mt-3">
        <Button type="submit">Create</Button>
      </div>
      <RequestError requestError={errorResponse} />

    </form>
  </div>
}