import { ParsedFunction } from "@artempoletsky/kurgandb/function";
import { ActionIcon } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import Code from "./Code";


function createCode(fn: ParsedFunction): string {
  const async = fn.isAsync ? "async " : "";
  return `${async}function (${fn.args.join(", ")}) {
    ${fn.body}
}`;
}


type Props = ParsedFunction & {
  className?: string;
  size?: string;
  onRemoveClick?: () => void;
  name?: string;
}

export function ParsedFunctionComponent(props: Props) {
  const code = createCode(props);

  if (!props.name) return <Code className={props.className} size={props.size} code={code} />;

  return <details className={props.className}>
    <summary>{props.name}
      {props.onRemoveClick && <ActionIcon className="ml-2 relative top-[3px]" size="xs" onClick={props.onRemoveClick}><Trash /></ActionIcon>}
    </summary>
    <Code size={props.size} code={code} />
  </details>
}