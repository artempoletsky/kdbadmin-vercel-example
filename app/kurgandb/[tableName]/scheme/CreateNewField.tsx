import { Button, Checkbox, Select, Tooltip } from "@mantine/core";
import TextInput from "../../comp/TextInput";
import { JSONErrorResponse } from "@artempoletsky/easyrpc/client";

import { useState } from "react";
import { FieldType, FieldTypes } from "@artempoletsky/kurgandb/globals";
import { AAddField, addField as ZAddField } from "../../api/schemas";

type Props = {
  requestError?: JSONErrorResponse
  onAddField: (args: AAddField) => void
  tableName: string
};

export default function CreateNewField(props: Props) {
  const { requestError, onAddField, tableName } = props;
  const [fieldName, setFieldName] = useState("");
  const [type, setFieldType] = useState<FieldType>("string");
  const [isHeavy, setIsHeavy] = useState(false);




  function onClick() {
    setFieldName("");
    onAddField({
      fieldName,
      tableName,
      type,
      isHeavy,
    });
  }
  // const setRequestError = useMantineRequestError(form);
  return <div className="mt-3">
    <p className="mb-1">Add a new field:</p>
    <div className="flex gap-1 border-b border-slate-800">
      <TextInput
        name="fieldName"
        autoComplete="off"
        error={requestError?.invalidFields?.fieldName?.message}
        placeholder="field name" value={fieldName}
        onChange={e => setFieldName(e.target.value)}
      />
      <Select value={type} data={FieldTypes} onChange={e => setFieldType(e as FieldType)} />
      <Tooltip label="Store this field as a separate file on each record">
        <div className="pt-2 mr-2">
          <Checkbox
            checked={isHeavy}
            onChange={e => setIsHeavy(e.target.checked)}
            classNames={{
              label: "cursor-help",
              input: "cursor-help",
            }}
            label="heavy"
          />
        </div>
      </Tooltip>
      <Button onClick={onClick}>Add</Button>
    </div>
  </div>
}