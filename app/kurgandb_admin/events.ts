import type { CallbackScope } from "@artempoletsky/kurgandb";
import type { TableOpenEvent } from "@artempoletsky/kurgandb/table";

type TableEventsDeclaration = Record<string, Record<string, (event: any, scope: CallbackScope) => void>>


const exampleTable1: TableEventsDeclaration = {
  "eventHandler1": {
    "tableOpen": (event: TableOpenEvent<any, any, any>, scope) => {

    }
  }
}

export default {
  // exampleTable1
}