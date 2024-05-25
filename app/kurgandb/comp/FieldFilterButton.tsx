import { ActionIcon, Menu } from "@mantine/core";
import { Filter } from "tabler-icons-react";

import { MouseEvent } from "react";
import { useStore } from "../store";

type Props = {
  fieldName: string;
  value: any;
};


export default function FieldFilterButton({ fieldName, value }: Props) {
  
  const [queryString, setQueryString] = useStore("queryString");

  const handleClick = (type: "exact" | "includes" | "startsWith") => (e: MouseEvent) => {
    let add = "";
    switch (type) {
      case "exact": add = `.where("${fieldName}",${getValue()})`; break;
      case "includes": add = `.where("${fieldName}",v=>v.includes(${getValue()}))`; break;
      case "startsWith": add = `.where("${fieldName}",v=>v.startsWith(${getValue()}))`; break;
      default:
        break;
    }
    let result = "t" + add;
    if (e.shiftKey) {
      result = queryString + add;
    }

    setQueryString(result);
  }
  function getValue() {
    const selection = window.getSelection()!.toString();
    if (!selection) return typeof value == "string" ? `"${value}"` : `${value}`;
    return `"${selection}"`;
  }

  const prevent = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  return <Menu>
    <Menu.Target>
      <ActionIcon
        onMouseDown={prevent}
        onMouseUp={prevent}
        onClick={prevent}
        className="bg-stone-400 mr-1"
        size="xs"
      ><Filter /></ActionIcon >
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Item onClick={handleClick("exact")}>Exact</Menu.Item>
      <Menu.Item onClick={handleClick("includes")}>Includes</Menu.Item>
      <Menu.Item onClick={handleClick("startsWith")}>Starts with</Menu.Item>
    </Menu.Dropdown>
  </Menu>
}