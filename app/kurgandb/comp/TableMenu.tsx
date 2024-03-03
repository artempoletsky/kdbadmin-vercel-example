"use client";

import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import { ActionIcon, Button, Tooltip } from "@mantine/core";
import Link from "next/link";
import { API_ENDPOINT, ROOT_PATH } from "../generated";
import type { FRemoveTable } from "../api/methods";

import { AirBalloon, Alarm, Asset, Edit, FileDatabase, Trash, ZoomExclamation } from 'tabler-icons-react';
import { ReactNode } from "react";

const removeTable = getAPIMethod<FRemoveTable>(API_ENDPOINT, "removeTable");

type Props = {
  tableName: string
}

type Item = {
  label: string
  icon: ReactNode
  href: string
}


export default function TableMenu({ tableName }: Props) {


  const Items: Item[] = [
    {
      label: "Edit documents",
      icon: <Edit />,
      href: `/${ROOT_PATH}/${tableName}`,
    },
    {
      label: "Edit scheme",
      icon: <FileDatabase />,
      href: `/${ROOT_PATH}/${tableName}/scheme`,
    },
    {
      label: "Browse events",
      icon: <Alarm />,
      href: `/${ROOT_PATH}/${tableName}/events`,
    },
    {
      label: "Validation rules",
      icon: <ZoomExclamation />,
      href: `/${ROOT_PATH}/${tableName}/validation`,
    },
    {
      label: "Custom",
      icon: <Asset />,
      href: `/${ROOT_PATH}/${tableName}/custom`,
    },
  ];

  function confirmRemoveTable() {
    // setRequestError(undefined);

    const delStr = prompt(`Type '${tableName}' to confirm removing this table`);
    if (delStr != tableName) return;
    removeTable({
      tableName,
    })
      .then(() => {
        window.location.href = `/${ROOT_PATH}/`;
      })
    // .catch(setRequestError);
  }

  return <div className="flex gap-3">
    {Items.map(e => (
      <Tooltip key={e.href} label={e.label}>
        <Link href={e.href}><ActionIcon size={36}>{e.icon}</ActionIcon></Link>
      </Tooltip>
    ))}
    <div className="grow"></div>
    <Tooltip key="remove" label="Remove table">
      <ActionIcon onClick={confirmRemoveTable} size={36}><Trash /></ActionIcon>
    </Tooltip>
  </div>
}