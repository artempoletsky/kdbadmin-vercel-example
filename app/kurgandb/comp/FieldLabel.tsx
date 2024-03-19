import { TableScheme } from "@artempoletsky/kurgandb/globals"
import { ActionIcon } from "@mantine/core"
import { Edit } from "tabler-icons-react"

type Props = {
  scheme: TableScheme
  fieldName: string
  onRename?: (oldName: string) => void
}

export default function FieldLabel({ scheme, fieldName, onRename }: Props) {
  const tags = scheme.tags[fieldName] || [];
  const type = scheme.fields[fieldName];
  // const tagsType: string[] = tags.slice(0);
  // tagsType.unshift(type);
  // const tagsStr = tagsType.join(", ");
  return <div className="mt-2">
    {onRename &&
      <ActionIcon
        className="mr-1"
        size="xs"
        onClick={e => onRename(fieldName)}>
        <Edit />
      </ActionIcon>}
    <label className="text-lg font-medium">{fieldName}</label>
    <span> ({type})</span>
    <span> {tags.join(", ")}</span>
  </div>
}