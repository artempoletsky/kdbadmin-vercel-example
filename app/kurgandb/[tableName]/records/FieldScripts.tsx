import { ActionIcon, Button, Menu } from "@mantine/core";
import { ScriptsRecord } from "../../globals";
import { Dots } from "tabler-icons-react";
import { PlainObject } from "@artempoletsky/kurgandb/globals";

type Props<Type> = {
  scripts: ScriptsRecord;
  proxy: PlainObject;
}
export default function FieldScripts<Type>({ scripts, proxy }: Props<Type>) {

  const scriptNames: Record<string, string> = {};
  for (const key in scripts) {
    scriptNames[key] = key.replaceAll("_", " ");
  }
  const scriptKeys = Object.keys(scriptNames);


  if (scriptKeys.length == 0) {
    return "";
  }

  const onScriptTrigger = (key: string) => () => {
    scripts[key](proxy);
  }

  if (scriptKeys.length == 1) {
    const key = scriptKeys[0];
    return <Button onClick={onScriptTrigger(key)} className="shrink">{scriptNames[key]}</Button>
  }

  return <Menu>
    <Menu.Target>
      <ActionIcon size={36}><Dots /></ActionIcon>
    </Menu.Target>
    <Menu.Dropdown>
      {scriptKeys.map(key => <Menu.Item onClick={onScriptTrigger(key)} key={key}>{scriptNames[key]}</Menu.Item>)}
    </Menu.Dropdown>
  </Menu>
}