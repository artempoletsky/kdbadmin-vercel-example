import { FieldTag, FieldTags, FieldType, FieldTypes, PlainObject } from "@artempoletsky/kurgandb/globals";
import z from "zod";

const ZStringNonEmpty = z.string().trim().min(1, "Required");

const ZTableOnly = z.object({
  tableName: ZStringNonEmpty,
});

export type ATableOnly = z.infer<typeof ZTableOnly>;

const ZEmpty = z.object({});



const ZKeyType = z.union([z.string(), z.number()]);


export const createDocument = z.object({
  tableName: ZStringNonEmpty,
  document: z.unknown(),
});
export type ACreateDocument = {
  tableName: string
  document: PlainObject
}


export const readDocument = z.object({
  tableName: ZStringNonEmpty,
  id: ZKeyType,
});
export type AReadDocument = z.infer<typeof readDocument>;


export const updateDocument = z.object({
  tableName: ZStringNonEmpty,
  id: ZKeyType,
  document: z.any(),
});
export type AUpdateDocument = z.infer<typeof updateDocument>;


export const deleteDocument = z.object({
  tableName: ZStringNonEmpty,
  id: ZKeyType,
});
export type ADeleteDocument = z.infer<typeof deleteDocument>;


export const getScheme = ZTableOnly;
export const getSchemePage = ZTableOnly;
export type AGetScheme = z.infer<typeof getScheme>;


export const queryRecords = z.object({
  tableName: ZStringNonEmpty,
  queryString: z.string(),
  page: z.number(),
});
export type AQueryRecords = z.infer<typeof queryRecords>;


export const toggleTag = z.object({
  tableName: ZStringNonEmpty,
  fieldName: ZStringNonEmpty,
  tagName: z.enum(FieldTags),
});
export type AToggleTag = z.infer<typeof toggleTag>;

// export type AToggleTag = {
//   tableName: string,
//   fieldName: string,
//   tagName: FieldTag,
// }


export const getFreeId = ZTableOnly;
export type AGetFreeId = z.infer<typeof getFreeId>;


export const getDraft = ZTableOnly;
export type AGetDraft = z.infer<typeof getDraft>;


export const addField = z.object({
  tableName: ZStringNonEmpty,
  fieldName: ZStringNonEmpty,
  type: z.union(FieldTypes.map(t => z.literal(t)) as any),
  isHeavy: z.boolean(),
});
export type AAddField = {
  tableName: string
  fieldName: string
  type: FieldType
  isHeavy: boolean
};


export const removeField = z.object({
  tableName: ZStringNonEmpty,
  fieldName: ZStringNonEmpty,
});
export type ARemoveField = z.infer<typeof removeField>;


export const changeFieldIndex = z.object({
  tableName: ZStringNonEmpty,
  fieldName: ZStringNonEmpty,
  newIndex: z.number(),
});
export type AChangeFieldIndex = z.infer<typeof changeFieldIndex>;


export const renameField = z.object({
  tableName: ZStringNonEmpty,
  fieldName: ZStringNonEmpty,
  newName: ZStringNonEmpty,
});
export type ARenameField = z.infer<typeof renameField>;


export const createTable = z.object({
  tableName: z.string().regex(/^[a-zA-Z]/, "Must start with a latin letter").trim().min(1, "Required"),
  keyType: z.union([z.literal("string"), z.literal("number")]),
  autoIncrement: z.boolean(),
});
export type ACreateTable = z.infer<typeof createTable>;


export const removeTable = ZTableOnly;
export type ARemoveTable = z.infer<typeof removeTable>;


export const authorize = z.object({
  userName: ZStringNonEmpty,
  password: ZStringNonEmpty,
});
export type AAuthorize = z.infer<typeof authorize>;


export const logout = ZEmpty;


export const executeScript = z.object({
  args: z.array(z.string()),
  path: ZStringNonEmpty,
});
export type AExecuteScript = z.infer<typeof executeScript>;


export const getAllTables = ZEmpty;
export const getAllTablesPage = ZEmpty;

export const getLogsList = ZEmpty;
export const getLogsListPage = ZEmpty;

export const getLog = z.object({
  fileName: ZStringNonEmpty,
});
export type AGetLog = z.infer<typeof getLog>;


export const getTableEvents = ZTableOnly;


export const toggleAdminEvent = z.object({
  tableName: ZStringNonEmpty,
  eventName: ZStringNonEmpty,
});
export type AToggleAdminEvent = z.infer<typeof toggleAdminEvent>;


export const unregisterEvent = z.object({
  tableName: ZStringNonEmpty,
  eventName: ZStringNonEmpty,
  namespaceId: ZStringNonEmpty,
});
export type AUnregisterEvent = z.infer<typeof unregisterEvent>;

export const getTableCustomPageData = ZTableOnly;

export const getTableValidation = ZTableOnly;

export const setCurrentTableValidator = ZTableOnly;
export const unsetCurrentTableValidator = ZTableOnly;
export const getInvalidRecords = ZTableOnly;