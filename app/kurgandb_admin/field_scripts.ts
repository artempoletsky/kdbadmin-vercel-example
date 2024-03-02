
import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import type { FExapleCustomMethod } from "./api";
import { API_ENDPOINT } from "../kurgandb/generated";
import { FieldScriptsObject } from "../kurgandb/globals";


const exampleCustomMethod = getAPIMethod<FExapleCustomMethod>(API_ENDPOINT, "exampleCustomMethod");

type User = { username: string };
export const fieldScripts: FieldScriptsObject = {
  users: { // the name of the table
    username: { // the name of the field
      reverse(record: User) {
        exampleCustomMethod({
          arg: record.username
        }).then(reversed => {
          record.username = reversed;
        })
      },
      script() {

      },
    }
  }
}
