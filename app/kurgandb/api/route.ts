import validate, { APIRequest, ResponseError } from "@artempoletsky/easyrpc";
import { Predicate, CallbackScope } from "@artempoletsky/kurgandb";
import { Table, TableScheme } from "@artempoletsky/kurgandb/table";
import { NextRequest, NextResponse } from "next/server";
import { queryUniversal as query } from "@artempoletsky/kurgandb";

import { FieldTag, PlainObject } from "@artempoletsky/kurgandb/globals";
import { isAdmin, login, logout as userLogout } from "../../kurgandb_admin/auth";

import * as schemas from "./schemas";


type Tables = Record<string, Table<any, any, any>>;
function methodFactory<PayloadType extends PlainObject, ReturnType>(predicate: Predicate<Tables, PayloadType, ReturnType>) {
  return async function (payload: PayloadType): Promise<ReturnType> {
    return await query(predicate, payload);
  }
}


const createDocument = methodFactory<schemas.ACreateDocument, string | number>((T, { tableName, document }, { db }) => {
  let t = db.getTable(tableName);
  const id = t.insert(document);
  return id;
});

export type FCreateDocument = typeof createDocument;
/////////////////////////////////////////////////////


const readDocument = methodFactory(({ }, { tableName, id }: schemas.AReadDocument, { db, $ }) => {
  let t = db.getTable<any, any, any>(tableName);
  return t.at(id, $.full);
});


export type FReadDocument = typeof readDocument;
/////////////////////////////////////////////////////


const updateDocument = methodFactory(({ }, { tableName, document, id }: schemas.AUpdateDocument, { db }) => {

  let t = db.getTable<string, any>(tableName);

  t.where(<any>t.primaryKey, id).update(doc => {
    for (const key in document) {
      doc.set(key, document[key]);
    }
  });
});

export type FUpdateDocument = typeof updateDocument;

/////////////////////////////////////////////////////


const deleteDocument = methodFactory(({ }, { tableName, id }: schemas.ADeleteDocument, { db }) => {
  let t = db.getTable<string, any>(tableName);

  t.where(<any>t.primaryKey, id).delete();
});

export type FDeleteDocument = typeof deleteDocument;

/////////////////////////////////////////////////////


export const getScheme = methodFactory(({ }, { tableName }: schemas.AGetScheme, { db }) => {
  let t = db.getTable(tableName);
  return t.scheme;
});

export type FGetScheme = typeof getScheme;

/////////////////////////////////////////////////////



export type RGetPage = {
  documents: any[]
  pagesCount: number
}


const getPage = methodFactory<schemas.AGetPage, RGetPage>(({ }, { tableName, queryString, page }, { db, $ }) => {
  let t = db.getTable(tableName);
  let table = t;
  let tq: any;
  if (!queryString) {
    tq = t.all().limit(0);
  } else {
    tq = eval(queryString).limit(0);
  }

  function paginage<Type>(array: Type[], page: number, pageSize: number) {
    // console.log(page);
    return {
      documents: array.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
      pagesCount: Math.ceil(array.length / pageSize),
    }
  }

  return paginage(<any[]>tq.select($.primary), page, 20);
});

export type FGetPage = typeof getPage;

/////////////////////////////////////////////////////


export const toggleTag = methodFactory<schemas.AToggleTag, TableScheme>(({ }, { tableName, fieldName, tagName }, { db }) => {
  let t = db.getTable(tableName);
  t.toggleTag(fieldName, tagName);

  return t.scheme;
});

export type FToggleTag = typeof toggleTag;


/////////////////////////////////////////



const getFreeId = methodFactory<schemas.AGetFreeId, number | string>(({ }, { tableName }, { db }) => {
  let t = db.getTable(tableName);
  return t.getFreeId();
});

export type FGetFreeId = typeof getFreeId;



///////////////////////////////////////////


const getDraft = methodFactory<schemas.AGetDraft, any>(({ }, { tableName }, { db }) => {
  let t = db.getTable(tableName);
  return t.getDocumentDraft();
});

export type FGetDraft = typeof getDraft;



///////////////////////////////////////////


const addField = methodFactory<schemas.AAddField, TableScheme>(({ }, { tableName, fieldName, type, isHeavy }, { db, ResponseError }) => {
  let t = db.getTable(tableName);
  try {
    t.addField(fieldName, type, isHeavy);
  } catch (err) {
    // throw err;

    throw new ResponseError({
      invalidFields: {
        fieldName: {
          message: "Already taken {...} ({...})",
          args: [t.scheme.fields[fieldName], t.scheme.tags[fieldName].join(", ")],
        }
      }
    });

  }

  return t.scheme;
});

export type FAddField = typeof addField;

///////////////////////////////////////////

const removeField = methodFactory<schemas.ARemoveField, TableScheme>(({ }, { tableName, fieldName }, { db }) => {
  let t = db.getTable(tableName);
  t.removeField(fieldName);
  return t.scheme;
});

export type FRemoveField = typeof removeField;


///////////////////////////////////////////

const changeFieldIndex = methodFactory<schemas.AChangeFieldIndex, TableScheme>(({ }, { tableName, fieldName, newIndex }, { db }) => {
  let t = db.getTable(tableName);
  t.changeFieldIndex(fieldName, newIndex);
  return t.scheme;
});

export type FChangeFieldIndex = typeof changeFieldIndex;

///////////////////////////////////////////


const renameField = methodFactory<schemas.ARenameField, TableScheme>(({ }, { tableName, fieldName, newName }, { db }) => {
  let t = db.getTable(tableName);
  t.renameField(fieldName, newName)
  return t.scheme;
});

export type FRenameField = typeof renameField;

///////////////////////////////////////////





const createTable = methodFactory<schemas.ACreateTable, TableScheme>(({ }, { tableName, keyType, autoIncrement }, { db }) => {
  const primaryTags: FieldTag[] = autoIncrement ? ["primary", "autoinc"] : ["primary"];
  const t = db.createTable({
    name: tableName,
    fields: {
      id: keyType,
    },
    tags: {
      id: primaryTags
    },
  });

  return t.scheme;
});

export type FCreateTable = typeof createTable;

///////////////////////////////////////////

const removeTable = methodFactory<schemas.ARemoveTable, void>(({ }, { tableName }, { db }) => {
  db.removeTable(tableName);
});

export type FRemoveTable = typeof removeTable;

///////////////////////////////////////////


const authorize = async ({ userName, password }: schemas.AAuthorize) => {
  const success = await login(userName, password);
  if (!success) throw new ResponseError("Incorrect username or password.");
  return success;
}

export type FAuthorize = typeof authorize;

///////////////////////////////////////////


const logout: () => Promise<void> = async () => {
  await userLogout();
}

export type FLogout = typeof logout;

///////////////////////////////////////////


import * as scripts from "../../kurgandb_admin/scripts";

export type ScriptsLogRecord = {
  time: number
  result: string
};

const executeScript = async ({ args, path }: schemas.AExecuteScript): Promise<ScriptsLogRecord> => {
  const steps = path.split(".");
  let current: PlainObject | Function = scripts as PlainObject;
  let self = current;
  while (steps.length > 1) {
    if (typeof current === "function")
      throw new ResponseError(`function has been found to early at '${steps[0]}' in '${path}'`);


    steps.shift();
    self = current;
    current = current[steps[0]];
  }
  if (typeof current != "function")
    throw new ResponseError(`Script path '${path}' hasn't been found`);


  const t1 = performance.now();
  let result = await current.apply(self, args);
  if (result === undefined) {
    result = "Success!";
  }

  return {
    time: Math.floor(performance.now() - t1),
    result,
  }
}

export type FExecuteScript = typeof executeScript;



///////////////////////////////////////////



import { customAPI, customRules } from "../../kurgandb_admin/api";
import { JSONErrorResponse } from "@artempoletsky/easyrpc/client";


export const POST = async function name(request: NextRequest) {
  const req: APIRequest = await request.json();
  if (!isAdmin() && req.method !== "authorize") {
    const err: JSONErrorResponse = {
      message: "You must authorize to perform this action",
      preferredErrorDisplay: "form",
      statusCode: 403,
      args: [],
      invalidFields: {}
    };
    return NextResponse.json(err, {
      status: 403
    });
  }


  let result, status;

  [result, status] = await validate(req, {
    ...schemas,
    ...customRules,
  }, {
    createDocument,
    readDocument,
    updateDocument,
    deleteDocument,
    getScheme,
    getPage,
    toggleTag,
    getFreeId,
    getDraft,
    addField,
    removeField,
    changeFieldIndex,
    renameField,
    createTable,
    removeTable,
    authorize,
    logout,
    executeScript,
    ...customAPI,
  });


  return NextResponse.json(result, status);
}

