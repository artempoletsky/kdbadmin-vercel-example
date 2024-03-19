"use client";

import { Button, TextInput } from "@mantine/core";
import { API_ENDPOINT, ROOT_PATH } from "../generated";
import { fetchCatch, getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { FExecuteScript, ScriptsLogRecord } from "../api/methods";
import { useRef } from "react";
import { invalidate } from "../comp/Link";
import { useRouter } from "next/navigation";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { formatName } from "./ScriptsPage";

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
  
  const onExecuteClick = fetchCatch({
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