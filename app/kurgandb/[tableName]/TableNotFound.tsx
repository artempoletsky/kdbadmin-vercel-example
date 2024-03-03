

type Props = {
  tableName: string
}

export default function TableNotFound({ tableName }: Props) {
  return (
    <div className="">{`Table '${tableName}' doesn't exist`}</div>
  )
}