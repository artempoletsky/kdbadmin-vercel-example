import { ActionIcon, Button, Checkbox, Menu, TextInput, Textarea } from "@mantine/core";
import { ScriptsRecord } from "../../globals";
import { Calendar, Dots } from "tabler-icons-react";
import { PlainObject } from "@artempoletsky/kurgandb/globals";
import { DatePicker, DateValue } from "@mantine/dates";
import { useRef } from "react";
import FieldDate from "./FieldDate";
import FieldJSON from "./FieldJSON";

type Props<Type> = {
  value: Type;
  onChange: (value: Type) => void;
  onJSONEdit: (fieldName: string) => void;
  name: string;
  type: "date" | "textarea" | "json" | "text" | "boolean";
}
export default function FieldSwitch<Type>(props: Props<Type>) {
  const { type } = props;
  if (type == "date") {
    return <FieldDate value={new Date(props.value as any)} onChange={props.onChange as any} name={props.name} />
  }
  else if (type == "textarea") {
    return <Textarea resize="both"
      name={props.name}
      value={props.value as any}
      onChange={e => props.onChange(e.target.value as any)}
    />;
  } else if (type == "boolean") {
    return <Checkbox checked={props.value as any} onChange={e => props.onChange(e.target.checked as any)} name={props.name} />
  } else if (type == "text") {
    return <TextInput
      value={props.value as any}
      onChange={e => props.onChange(e.target.value as any)}
      autoComplete="off"
      size="sm"
      variant="default"
      type="text"
      name={props.name}
    />
  } else if (type == "json") {
    return <FieldJSON value={props.value} name={props.name} onEdit={props.onJSONEdit} />
  }
  else return "";
}