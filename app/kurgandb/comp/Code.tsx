"use client";

import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { useState } from "react";
import { Copy } from "tabler-icons-react";
import { blinkBoolean } from "../utils_client";

type Props = {
  code: string;
  className?: string;
  size?: string;
}

export default function Code(props: Props) {

  const [tooltipOpened, setTooltipOpened] = useState(false);

  const size = props.size || "base";
  function copyClick() {
    navigator.clipboard.writeText(props.code);
    blinkBoolean(setTooltipOpened);
  }
  return <div className={props.className + ` rounded relative p-3 bg-stone-400 text-black`}>
    <div className="absolute right-2 top-2">
      <Tooltip opened={tooltipOpened} label="Copied!">
        <ActionIcon className="bg-stone-300 text-black" onClick={copyClick}>
          <Copy />
        </ActionIcon>
        {/* <Button onClick={copyDocumentType}>Copy document type to clipboard</Button> */}
      </Tooltip>
    </div>
    <p className={`whitespace-pre text-${size} overflow-auto`}>
      {props.code}
    </p>
  </div >

}