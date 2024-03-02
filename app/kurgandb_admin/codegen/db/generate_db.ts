import type { TableScheme } from "@artempoletsky/kurgandb/table"
import { queryUniversal as query } from "@artempoletsky/kurgandb";
import fs from "fs";
import type { FieldType } from "@artempoletsky/kurgandb/globals";
import generateCodeFile from "../generate";

type AllTableSchemas = Record<string, TableScheme>;


async function getAllTablesSchemas(): Promise<AllTableSchemas> {
  return await query(({ }, { }, { db }) => {
    const res: AllTableSchemas = {};
    const tableNames = Object.keys(db.getTables());
    for (const key of tableNames) {
      res[key] = db.getScheme(key) as any;
    }
    return res;
  }, {});
}

function tableNameToTypeName(tableName: string): string {
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


function getTablePrimaryKey(scheme: TableScheme): string {
  for (const fieldName in scheme.tags) {
    if (scheme.tags[fieldName].includes("primary")) return fieldName;
  }
  throw new Error("can't find the primary key in the table scheme");
}

function getTableKeyType(scheme: TableScheme): string {
  return scheme.fields[getTablePrimaryKey(scheme)];
}



function typeToTsType(type: FieldType): string {
  switch (type) {
    case "date": return "Date";
    case "json": return "any";
    default: return type;
  }
}

function typeToZod(type: FieldType): string {
  switch (type) {
    case "date": return "z.date()";
    case "json": return "z.any()";
    default: return `z.${type}()`;
  }
}


function generateTablesTypeDef(scheme: AllTableSchemas) {
  let result = `export type Tables = {\r\n`;
  for (const tableName in scheme) {
    result += `  ${tableName}: Table<${getTableKeyType(scheme[tableName])}, types.${tableNameToTypeName(tableName)}>;\r\n`;
  }

  result += `};`;

  return result;
}


function generateTablesTypes(scheme: AllTableSchemas) {
  let types = "";
  for (const tableName in scheme) {
    const tScheme = scheme[tableName];
    const typeName = tableNameToTypeName(tableName);

    types += `export type ${typeName} = {\r\n`;
    for (const fieldName in tScheme.fields) {
      const type = tScheme.fields[fieldName];
      const tsType = typeToTsType(type);
      types += `  ${fieldName}: ${tsType};\r\n`;
    }
    types += `}\r\n\r\n\r\n`;
  }
  return types;
}



function generateTablesSchemas(scheme: AllTableSchemas) {
  let types = "";
  for (const tableName in scheme) {
    const tScheme = scheme[tableName];
    const typeName = tableNameToTypeName(tableName);

    types += `export const Z${typeName} = z.object({\r\n`;
    for (const fieldName in tScheme.fields) {
      const type = tScheme.fields[fieldName];
      const zodType = typeToZod(type);
      types += `  ${fieldName}: ${zodType},\r\n`;
    }
    types += `});\r\n\r\n`;

    types += `export type ${typeName} = z.infer<typeof Z${typeName}>;\r\n\r\n\r\n`;

  }
  return types;
}



export default async function generateDB(): Promise<string> {
  let result = "";
  const scheme: AllTableSchemas = await getAllTablesSchemas();

  const dbOut = process.cwd() + "/db.ts";
  const globalsOut = process.cwd() + "/globals.ts";
  const sourcePath = `${process.cwd()}/app/kurgandb_admin/codegen/db`;


  if (fs.existsSync(dbOut)) {
    result += "db.ts exists, skipping... ";
  } else {
    generateCodeFile(sourcePath + "/db.ts.txt", dbOut, {
      $$TABLES$$: generateTablesTypeDef(scheme),
    });
    result += "db.ts generated; ";
  }



  if (fs.existsSync(globalsOut)) {
    result += "globals.ts exists, skipping... ";
  } else {
    generateCodeFile(sourcePath + "/globals.ts.txt", globalsOut, {
      $$API_HOST$$: "http://localhost:3000",
      $$SCHEMAS$$: generateTablesSchemas(scheme),
    });
    result += "globals.ts generated; ";
  }

  return result;
}