import { ActionIcon, Button, Menu, TextInput } from "@mantine/core";
import { ScriptsRecord } from "../../globals";
import { Calendar, Dots } from "tabler-icons-react";
import { PlainObject } from "@artempoletsky/kurgandb/globals";
import { DatePicker, DateValue } from "@mantine/dates";
import { useRef } from "react";

type Props = {
  value: Date;
  onChange: (value: DateValue) => void;
  name: string;
}
export default function FieldDate({ value, onChange, name }: Props) {

  function updateDateInput(date: DateValue) {
    if (!inputRef.current) throw new Error("no ref");
    if (!date) throw new Error("Date is null");

    inputRef.current.value = date.toUTCString();
    onChange(date);
  }
  const inputRef = useRef<HTMLInputElement>(null)

  return <div className="flex gap-3">
    <Menu>
      <Menu.Target>
        <ActionIcon size={36}><Calendar /></ActionIcon>
      </Menu.Target>
      <Menu.Dropdown >
        <DatePicker defaultDate={value} value={value} onChange={updateDateInput} />
      </Menu.Dropdown>
    </Menu>
    <div className="grow"><TextInput
      ref={inputRef}
      name={name}
      defaultValue={value.toUTCString()}
      onBlur={e => {
        const d = new Date(e.target.value);
        if (!isNaN(d as any)) {
          onChange(d);
        } else {
          e.target.value = value.toUTCString();
        }
      }} autoComplete="off" size="sm" /></div>

  </div>
}