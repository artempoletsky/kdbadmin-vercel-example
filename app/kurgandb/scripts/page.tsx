

import Layout, { BreadrumbsArray } from "../comp/PageLayout";

import * as scriptsRaw from "../../kurgandb_admin/scripts";

import ScriptsPage, { Group, ParsedFunction as ParsedFunctionClient } from "./ScriptsPage";
import { PlainObject } from "@artempoletsky/kurgandb/globals";
import { parseFunction, ParsedFunction } from "@artempoletsky/kurgandb/function";
export const dynamic = "force-static";

function prepareFunction(f: Function): ParsedFunctionClient | false {
  const { body, args, isAsync } = parseFunction(f);

  let description = "";
  if (body.startsWith("//")) {
    const descMatched = /^\/\/([^\n]+)/.exec(body);
    if (descMatched) {
      description = descMatched[1];
    }
  }
  
  return {
    args: args,
    description,
  }
}

function createGroup(scripts: PlainObject): Group {
  const result: Group = {};
  for (const key in scripts) {
    const value = scripts[key];
    if (typeof value == "function") {
      result[key] = {
        fun: prepareFunction(value),
      }
    } else {
      result[key] = {
        children: createGroup(value),
      }
    }
  }
  return result;
}

const scripts: Group = createGroup(scriptsRaw);

export default async function page() {

  const crumbs: BreadrumbsArray = [
    { href: "/", title: "Tables" },
    { href: "", title: "Scripts" },
  ];


  return (
    <Layout breadcrumbs={crumbs}>
      <ScriptsPage scripts={scripts} />
    </Layout>
  );
}