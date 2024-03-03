

import Layout, { BreadrumbsArray } from "../comp/PageLayout";

import * as scriptsRaw from "../../kurgandb_admin/scripts";

import ScriptsPage, { Group, ParsedFunction } from "./ScriptsPage";
import { PlainObject } from "@artempoletsky/kurgandb/globals";



function parseFunction(f: Function): ParsedFunction | false {
  const str = f.toString();
  let start = str.match(/[^\{]+/);
  if (!start) return false;

  const matched = /\(([^\)]+)\)/.exec(start[0]);
  let args: string[] = [];
  if (matched) {
    args = matched[1].replace(/\s/, "").split(",");
  }

  let body = str.slice(start[0].length + 1).trim();

  let description = "";
  if (body.startsWith("//")) {
    const descMatched = /\{\s*\/\/([^\n]+)/.exec(str);
    if (descMatched) {
      description = descMatched[1];
    }
  }

  return {
    args,
    description,
  }
}

function createGroup(scripts: PlainObject): Group {
  const result: Group = {};
  for (const key in scripts) {
    const value = scripts[key];
    if (typeof value == "function") {
      result[key] = {
        fun: parseFunction(value),
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