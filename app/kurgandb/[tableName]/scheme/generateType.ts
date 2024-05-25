import { FieldTag, FieldType, TableScheme } from "@artempoletsky/kurgandb/globals";


export function getFieldsWithTag(scheme: TableScheme, tag: FieldTag): string[] {
  const result: string[] = [];
  for (const fieldName in scheme.tags) {
    if (scheme.tags[fieldName].includes(tag)) {
      result.push(fieldName);
    }
  }
  return result;
}

export function getTablePrimaryKey(scheme: TableScheme): string {
  const p = getFieldsWithTag(scheme, "primary");
  if (p.length != 1) throw new Error("Invalid primary keys count");
  return p[0];
}


export function getTableKeyType(scheme: TableScheme): string {
  return scheme.fields[getTablePrimaryKey(scheme)];
}



export function tableNameToTypeName(tableName: string): string {
  if (tableName.endsWith("s")) {
    tableName = tableName.slice(0, tableName.length - 1);
  }
  const words = tableName.split("_").map(w => {
    if (!w) return "";
    const first = w[0].toUpperCase();
    return first + w.substring(1);
  });
  return words.join("");
}


export function getTableTags(scheme: TableScheme): Set<FieldTag> {
  const result = new Set<FieldTag>();
  for (const key in scheme.tags) {
    for (const tag of scheme.tags[key]) {
      result.add(tag);
    }
  }
  return result;
}


export function getTypeNames(tableName: string, scheme: TableScheme) {
  const tags = getTableTags(scheme);
  const basic = tableNameToTypeName(tableName);
  const visible = tags.has("hidden") ? basic : "";
  const full = visible ? `${basic}Full` : basic;
  const light = tags.has("heavy") ? `${basic}Light` : (visible ? basic : "");
  const insert = tags.has("autoinc") ? `${basic}Insert` : (light ? full : "");
  const meta = `${basic}sMeta`;

  return {
    primary: getTablePrimaryKey(scheme),
    basic,
    full,
    idT: getTableKeyType(scheme),
    meta,
    insert,
    light,
    visible,
  };
}

export function fieldTypeToZod(type: FieldType): string {
  switch (type) {
    case "date": return "z.date()";
    case "json": return "z.any()";
    default: return `z.${type}()`;
  }
}


export function printFieldsWithTag(tScheme: TableScheme, tag: FieldTag) {
  return getFieldsWithTag(tScheme, tag).map(t => `"${t}"`).join(" | ");
}


export function generateRecordTypesFromScheme(tScheme: TableScheme, tableName: string) {
  let result = "";

  const names = getTypeNames(tableName, tScheme);
  const tags = getTableTags(tScheme);

  result += `export const Z${names.basic} = z.object({\r\n`;
  for (const fieldName of tScheme.fieldsOrderUser) {
    const type = tScheme.fields[fieldName];
    const zodType = fieldTypeToZod(type);
    result += `  ${fieldName}: ${zodType},\r\n`;
  }
  result += `});\r\n\r\n`;

  result += `export type ${names.full} = z.infer<typeof Z${names.basic}>;\r\n\r\n`;

  if (tags.has("autoinc"))
    result += `export type ${names.insert} = Omit<${names.full}, "${names.primary}">;\r\n\r\n`;

  if (tags.has("heavy"))
    result += `export type ${names.light} = Omit<${names.full}, ${printFieldsWithTag(tScheme, "heavy")}>;\r\n\r\n`;

  if (tags.has("hidden")) {
    result += `export type ${names.visible} = Omit<${names.full}, ${printFieldsWithTag(tScheme, "hidden")}>;\r\n\r\n`;
  }
  return result;
}


export function generateCreateTable(tScheme: TableScheme, tableName: string) {
  let fields = "";
  let tags = "";
  for (const fieldName of tScheme.fieldsOrderUser) {
    const type = tScheme.fields[fieldName];
    fields += `    ${fieldName}: "${type}", \r\n`;

    const value = tScheme.tags[fieldName];
    tags += `    ${fieldName}: [${value.map(v => `"${v}"`).join(", ")}], \r\n`;
  }

  let result = `db.createTable({
  name: "${tableName}",
  fields: {
${fields}  },
  tags: {
${tags}  }
});`;
  return result;
}