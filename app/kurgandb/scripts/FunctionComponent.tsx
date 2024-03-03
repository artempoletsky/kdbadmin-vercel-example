"use client";

import { Button, TextInput } from "@mantine/core";
import { API_ENDPOINT } from "../generated";
import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { FExecuteScript, ScriptsLogRecord } from "../api/methods";
import { useRef } from "react";

const executeScript = getAPIMethod<FExecuteScript>(API_ENDPOINT, "executeScript");


type Props = {
  description: string
  args: string[]
  path: string
  name: string
  className?: string
  onLog: (args: ScriptsLogRecord) => void
}

export default function FunctionComponent({ className, description, args, path, name, onLog }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  function onExecuteClick() {
    const form = formRef.current;
    if (!form) throw new Error("form is undefined");

    let args = Array.from(form.querySelectorAll("input")).map(input => input.value);
    onLog({
      result: `Executing ${name}...`,
      time: -1
    });
    executeScript({
      args,
      path,
    }).then(onLog);
  }

  function printArguments(args: string[], path: string) {
    return <div className="inline-flex gap-3">{args.map(key => <TextInput autoComplete="off" name={key} key={key} placeholder={key} />)}</div>;
  }

  return (
    <form ref={formRef} className={className} id={`script_form_${path}`}>
      <div>{description}</div>
      <Button onClick={onExecuteClick} className="mr-3">{name}</Button>
      {printArguments(args, path)}
    </form>
  );
}