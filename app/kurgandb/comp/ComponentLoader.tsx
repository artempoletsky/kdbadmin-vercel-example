"use client";

import { getAPIMethod } from "@artempoletsky/easyrpc/client";
import { useErrorResponse } from "@artempoletsky/easyrpc/react";
import { ComponentType, ElementType, ReactElement, ReactNode, useEffect, useState } from "react";
import { FGetTableEvents } from "../api/methods";
import { API_ENDPOINT } from "../generated";
import RequestError from "./RequestError";
import { Loader } from "@mantine/core";
import { adminRPC } from "../globals";


export class Mutator<RT>  {
  setter: ((res: RT) => void) | undefined
  trigger(res: RT) {
    console.log(res);
    if (this.setter) this.setter(res);
  }
}


type Props<AT, RT, PT> = {
  method: (arg: AT) => Promise<RT>;
  Component: ComponentType<RT & AT & PT>;
  args: AT | null;
  props?: PT;
  children?: ReactNode;
  onData?: (res: RT) => void;
  error?: ReactNode;
  mutator?: Mutator<RT>;
}

export default function ComponentLoader
  <AT, RT, PT>
  ({ Component, children, args, method: methodHack, props, onData, error, mutator }: Props<AT, RT, PT>) {
  const methodName = methodHack as unknown as string;

  const _props: PT = props || {} as PT;
  const [setErrorResponse, mainErrorMessage, errorResponse] = useErrorResponse();
  const method = getAPIMethod<(arg: AT) => Promise<RT>>(API_ENDPOINT, methodName);

  
  const [data, setData] = useState<RT>();
  useEffect(() => {
    setData(undefined);
    setErrorResponse();
    if (!args) return;
    method(args).then(res => {
      setData(res);
      if (onData) onData(res);
    }).catch(errorResponse => {
      setData(undefined);
      setErrorResponse(errorResponse);
    });
    if (mutator) {
      mutator.setter = setData;
    }
  }, [args]); // eslint-disable-line

  if (!args) return "";
  if (!data && !errorResponse) {
    if (children) return children;
    return <Loader type="dots" />
  }
  if (data) return <Component {...data} {...args} {..._props} ></Component>;

  if (error) return error;
  return <RequestError requestError={errorResponse}></RequestError>;
}

