import { useEffect, useState } from "react";



type Props = {
  documents: string[] | number[];
  onRecordSelect(id: string | number): void;
  current: string | number | undefined;
}
export default function RecordsList({ documents, onRecordSelect, current }: Props) {
  if (!documents.length) return <div className="sidebar">No records found</div>

  // console.log(current);

  // const [current, setCurrent] = useState<string | number>();
  // useEffect(() => setCurrent(undefined), [documents]);

  const onClick = (id: string | number) => () => {
    // setCurrent(id);
    onRecordSelect(id);
  }
  return <ul className="sidebar">
    {documents.map(id => <li className={"sidebar_li" + (id === current ? " current" : "")} key={id} onClick={onClick(id)}>{id}</li>)}
  </ul>
}