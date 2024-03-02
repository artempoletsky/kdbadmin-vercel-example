import { PlainObject } from "@artempoletsky/kurgandb/globals";
import { Button, JsonInput } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  record: PlainObject
  fieldName: string
  close: () => void
}
export default function EditJSON({ record, fieldName, close }: Props) {
  const [result, setResult] = useState("null");

  useEffect(() => {
    setResult(JSON.stringify(record[fieldName], undefined, 2));
  }, [record, fieldName]);

  function save() {
    let res = "";
    let success = false;
    try {
      res = JSON.parse(result);
      success = true;
    } catch (e) { }
    if (success) {
      record[fieldName] = res;
      close();
    }
  }

  return <div className="">
    <JsonInput
      formatOnBlur
      autosize
      minRows={4}
      value={result}
      onChange={setResult}
      // validationError={ }
    />
    <div className="flex gap-3 mt-3">
      <Button onClick={save}>Save</Button>
    </div>
  </div>
}