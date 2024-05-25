"use client";

import { fetchCatch } from "@artempoletsky/easyrpc/react";
import { ActionIcon, Tooltip } from "@mantine/core";
import Link from "next/link";
import { ROOT_PATH } from "../generated";

import { Alarm, Asset, Edit, FileDatabase, Trash, ZoomExclamation } from 'tabler-icons-react';
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { adminRPC } from "../globals";

const removeTable = adminRPC().method("removeTable");
type Props = {
  tableName: string
}

type Item = {
  label: string
  icon: ReactNode
  href: string
}


export default function TableHeader({ tableName }: Props) {


  const Items: Item[] = [
    {
      label: "Edit records",
      icon: <FileDatabase />,
      href: `/${ROOT_PATH}/${tableName}/records`,
    },
    {
      label: "Edit scheme",
      icon: <Edit />,
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


  const router = useRouter();
  const doConfirmRemoveTable = fetchCatch(removeTable)
    .before(() => {
      const delStr = prompt(`Type '${tableName}' to confirm removing this table`);
      if (delStr != tableName) return;
      return { tableName };
    })
    .then(() => { router.replace(`/${ROOT_PATH}/`); }).action();

  return <div className="flex gap-3">
    {Items.map(e => (
      <Tooltip key={e.href} label={e.label}>
        <Link href={e.href}><ActionIcon size={36}>{e.icon}</ActionIcon></Link>
      </Tooltip>
    ))}
    <div className="grow"></div>
    <Tooltip key="remove" label="Remove table">
      <ActionIcon onClick={doConfirmRemoveTable} size={36}><Trash /></ActionIcon>
    </Tooltip>
  </div>
}