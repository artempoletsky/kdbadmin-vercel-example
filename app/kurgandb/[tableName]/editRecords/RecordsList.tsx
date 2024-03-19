import { CompType, FQueryRecords } from "../../api/methods";
import css from "../../admin.module.css";


type Props = {
  documents: string[] | number[];
  onRecordSelect(id: string | number): void;
}
export default function RecordsList({ documents, onRecordSelect }: Props) {
  if (!documents.length) return <div className={css.sidebar}>No records found</div>

  return <ul className={css.sidebar}>
    {documents.map(id => <li className={css.sidebar_li} key={id} onClick={e => onRecordSelect(id)}>{id}</li>)}
  </ul>
}