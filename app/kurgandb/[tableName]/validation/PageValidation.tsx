"use client";

import { fetchCatch, useErrorResponse } from "@artempoletsky/easyrpc/react";
import { useState } from "react";
import { Button } from "@mantine/core";
import type { RGetTableValidation, RUpdateValidationPage } from "../../api/methods";
import { ROOT_PATH } from "../../generated";
import { ParsedFunctionComponent } from "../../comp/ParsedFunctionComponent";
import type { PlainObject } from "@artempoletsky/kurgandb/globals";
import type { ATableOnly } from "../../api/schemas";
import { LightRecordDetails } from "./LigthRecordDetails";
import Link from "../../comp/Link";
import { adminRPC } from "../../globals";

const {
  setCurrentTableValidator,
  unsetCurrentTableValidator,
  getInvalidRecords,
} = adminRPC().methods("setCurrentTableValidator", "unsetCurrentTableValidator", "getInvalidRecords");


type Props = RGetTableValidation & ATableOnly;

export default function TestComponent({
  adminValidator,
  currentValidator: initialCurrentValidator,
  tableName,
  primaryKey,
  invalidRecords: invalidRecordsInitial
}: Props) {

  const [currentValidator, setCurrentValidator] = useState(initialCurrentValidator);
  const [invalidRecords, setInvalidRecords] = useState<PlainObject[]>(invalidRecordsInitial);
  const [setErrorResponse, mainErrorMessage, errorResponse] = useErrorResponse();


  function showSuccess(data: RUpdateValidationPage) {
    setCurrentValidator(data.currentValidator);
    setInvalidRecords(data.invalidRecords);
    alert("Success!");
  }
  const fc = fetchCatch({
    before: () => ({
      tableName,
    }),
    then: showSuccess,
    errorCatcher: setErrorResponse,
  });


  const doSet = fc.method(setCurrentTableValidator).action();

  const doUnset = fc.method(unsetCurrentTableValidator).action();


  return (
    <div className="">
      <div className="flex mb-10">
        <div className="col_l">
          {adminValidator
            ? <div className="">
              <p className="h2">Admin validator:</p>
              <Button onClick={doSet}>Activate</Button>
              <ParsedFunctionComponent {...adminValidator} />
            </div>
            : <div className="">
              <p className="h2">No admin validator specified</p>
              <p className="">Add a validator to /app/kurgandb_admin/validation.ts like this:</p>
              <p className="whitespace-pre mt-2 p-3 bg-slate-800 text-gray-100">
                {`export const ${tableName}: RecordValidator = (${tableName}, { z }) => {
  return z.object({
    username: z.string().min(1, "Required"),
    password: z.string().length(32, "Must be an md5 hash"),
    isAdmin: z.boolean(),
    about: z.string().max(1024, "Description is too long!"),
  });
}`}
              </p>
            </div>
          }
        </div>
        <div className="col_r">
          <p className="h2">Current validator:</p>
          <ParsedFunctionComponent onRemoveClick={doUnset} name="Current validator" {...currentValidator} />
        </div>
      </div>
      {invalidRecords.length
        ? <div className="">
          <div className="h3">The table has invalid records:</div>
          <div className="mb-1 mt-2"><Link href={`/${ROOT_PATH}/${tableName}/records#q=t.filter($.invalid)`}>Edit records</Link></div>
          {invalidRecords.map(rec => <LightRecordDetails key={rec[primaryKey]} record={rec} primaryKey={primaryKey} />)}
        </div>
        : <div className="h3">All records are valid</div>}
      <div className="text-red-600 min-h-[24px]">{mainErrorMessage}</div>

    </div>
  );
}