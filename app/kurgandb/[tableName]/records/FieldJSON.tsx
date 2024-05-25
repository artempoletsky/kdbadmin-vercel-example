import { ActionIcon } from "@mantine/core";
import { Edit } from "tabler-icons-react";

type Props = {
  value: any;
  name: string;
  onEdit: (name: string) => void;
}

function formatJSON(value: any): string {
  return JSON.stringify(value).slice(0, 12);
}
export default function FieldJSON({ value, onEdit, name }: Props) {

  return <div className="flex">
    <div className="grow break-words overflow-hidden overflow-ellipsis max-w-[462px] max-h-[50px]">
      {formatJSON(value)}
    </div>
    <ActionIcon onClick={e => {
      onEdit(name);
    }} size={32}><Edit /></ActionIcon>
  </div>
}