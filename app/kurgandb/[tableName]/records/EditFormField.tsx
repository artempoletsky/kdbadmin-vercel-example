import { FieldTag, FieldType, PlainObject } from "@artempoletsky/kurgandb/globals";
import { ScriptsRecord } from "../../globals";
import FieldScripts from "./FieldScripts";
import FieldSwitch from "./FieldSwitch";

type Props<Type> = {
  onChange: (newValue: Type) => void;
  value: Type;
  scriptsObject: ScriptsRecord;
  proxy: PlainObject;
  fieldName: string;
  type: FieldType;
  tags: Set<FieldTag>;
  onJSONEdit: (fieldName: string) => void;
}
export default function EditFormField<Type>({
  onChange, scriptsObject, proxy, fieldName, type, tags,
  onJSONEdit
}: Props<Type>) {
  let t: any = tags.has("textarea") ? "textarea" : type;
  if (t == "string" || t == "number") {
    t = "text";
  }
  if (scriptsObject) {
    return <div className="flex gap-3">
      <div className="grow">
        <FieldSwitch
          onChange={onChange}
          value={proxy[fieldName]}
          name={fieldName}
          type={t}
          onJSONEdit={onJSONEdit}
        />
      </div>
      <div className="shrink">
        <FieldScripts proxy={proxy} scripts={scriptsObject} />
      </div>
    </div>
  }
  return <FieldSwitch
    onChange={onChange}
    value={proxy[fieldName]}
    name={fieldName}
    type={t}
    onJSONEdit={onJSONEdit}
  />
}