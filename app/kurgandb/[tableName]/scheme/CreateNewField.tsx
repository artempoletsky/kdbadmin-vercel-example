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
  return <div className="ml-3 mr-3">
    <p className="mb-1">Create a new field:</p>
    <div className="w-[350px]">
      <TextInput
        name="fieldName"
        autoComplete="off"
        error={requestError?.invalidFields?.fieldName?.message}
        placeholder="field name" value={fieldName}
        onChange={e => setFieldName(e.target.value)}
      />
      <Select className="mb-3" allowDeselect={false} value={type} data={FieldTypes} onChange={e => setFieldType(e as FieldType)} />
      <div className="pt-2 mb-3">
        <Tooltip label="Store this field as a separate file on each record">
          <span>
            <Checkbox
              checked={isHeavy}
              onChange={e => setIsHeavy(e.target.checked)}
              classNames={{
                root: "inline-block",
                label: "cursor-help",
                input: "cursor-help",
              }}
              label="heavy"
            />
          </span>
        </Tooltip>
      </div>
      <Button onClick={onClick}>Create</Button>
    </div>
  </div>
}