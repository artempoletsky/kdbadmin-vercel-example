"use client";


import { fetchCatch, useErrorResponse } from "@artempoletsky/easyrpc/react";

import { ReactNode, useEffect, useState } from "react";
import type { RGetPlugins } from "../api/methods";
import { Button } from "@mantine/core";
import { ParsedFunctionComponent } from "../comp/ParsedFunctionComponent";
import { adminRPC } from "../globals";
import { useStoreEffectSet } from "../store";

const togglePlugin = adminRPC().method("togglePlugin")

type Props = {
  plugins: string[];
};
export default function PagePlugins({ registeredPlugins: pluginsInitial, adminPlugins }: RGetPlugins) {
  useStoreEffectSet("tableName", "");

  const [plugins, setPlugins] = useState(pluginsInitial);
  const [setErrorResponse, mainErrorMessage, errorResponse] = useErrorResponse();
  const fc = fetchCatch({
    method: togglePlugin,
    before(pluginName: string) {
      return {
        pluginName
      }
    },
    then: setPlugins,
    errorCatcher: setErrorResponse,
  });

  const confirmRemove = fc.confirm(async () => {
    return confirm("Are you sure you want to unregister this plugin?")
  })

  function isPluginActive(name: string) {
    return !!plugins[name];
  }

  const activePlugins: ReactNode[] = [];
  for (const name in plugins) {
    activePlugins.push(<ParsedFunctionComponent
      key={name}
      name={name}
      {...plugins[name]}
      onRemoveClick={confirmRemove.action(name)}
    />);
  }
  return (
    <div className="">
      <div className="flex mb-10">
        <div className="col_l">
          <h2 className="h2">Admin plugins:</h2>
          {adminPlugins.map(name => <div className="mb-2" key={name}>
            <Button
              className="w-[250px] mr-3"
              onClick={fc.action(name)}
            >{name}</Button> {isPluginActive(name) && <span className="text-green-800">Active</span>}
          </div>)}
        </div>
        <div className="col_r">
          <h2 className="h2">Active plugins:</h2>
          {activePlugins}
        </div>
      </div>
    </div>
  );
}