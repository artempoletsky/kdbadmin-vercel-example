"use client";

import { Button, TextInput } from "@mantine/core";
import { fetchCatch } from "@artempoletsky/easyrpc/react";
import type { ScriptsLogRecord } from "../api/methods";
import { useRef } from "react";
import { formatName } from "./PageScripts";
import { adminRPC } from "../globals";

const executeScript = adminRPC().method("executeScript")

type Props = {
  description: string;
  args: string[];
  path: string;
  name: string;
  className?: string;
  onLog: (args: ScriptsLogRecord) => void;
  confirm?: boolean;
}

export default function FunctionComponent({ className, description, args, path, name, onLog, confirm: useConfirm }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const onExecuteClick = fetchCatch({
    async confirm() {
      return !useConfirm || confirm("Are you sure you want to execute this script?");
    },
    method: executeScript,
    before: () => {
      const form = formRef.current;
      if (!form) throw new Error("form is undefined");
      let args = Array.from(form.querySelectorAll("input")).map(input => input.value);
      onLog({
        result: `Executing ${name}...`,
        time: -1
      });
      return { args, path };
    },
    then: result => {
      // invalidate("/");
      onLog(result);
    }
  }).action();

  function printArguments(args: string[], path: string) {
    return <div className="inline-flex gap-3">{args.map(key => <TextInput autoComplete="off" name={key} key={key} placeholder={formatName(key)} />)}</div>;
  }

  return (
    <form ref={formRef} className={className} id={`script_form_${path}`}>
      <div>{description}</div>
      <Button onClick={onExecuteClick} className="mr-3">{name}</Button>
      {printArguments(args, path)}
    </form>
  );
}