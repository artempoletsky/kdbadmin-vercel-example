import { ParsedFunction } from "@artempoletsky/kurgandb/function";
import { ActionIcon } from "@mantine/core";
import { Trash } from "tabler-icons-react";


export function ParsedFunctionComponent({ name, onRemoveClick, args, body, isAsync }: ParsedFunction & {
  onRemoveClick?: () => void;
  name?: string;
}) {

  function printFn() {
    return <div>{`${isAsync ? "async " : ""}(${args.join(", ")})`}
      <p className="whitespace-pre overflow-auto">
        {body}
      </p>
    </div>
  }
  if (!name) return printFn();
  if (name)
    return <details>
      <summary>{name}
        {onRemoveClick && <ActionIcon className="ml-2 relative top-[3px]" size="xs" onClick={onRemoveClick}><Trash /></ActionIcon>}
      </summary>
      {printFn()}
    </details>
}