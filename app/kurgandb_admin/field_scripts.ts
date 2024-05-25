
import { FieldScriptsObject, adminRPCCustom } from "../kurgandb/globals";
import { encodePassword } from "@artempoletsky/kurgandb/globals";

const exampleCustomMethod = adminRPCCustom().method("exampleCustomMethod");

type UserFull = { username: string, password: string };
export const fieldScripts: FieldScriptsObject = {
  users: { // the name of the table
    username: { // the name of the field
      Reverse(record: UserFull) {
        exampleCustomMethod({
          arg: record.username
        }).then(reversed => {
          record.username = reversed;
        })
      },
      Script() {

      },
    },
    password: {
      Encode(record: UserFull) {
        record.password = encodePassword(record.password);
      }
    },
    data: {
      Test123123() {

      }
    }
  }
}
