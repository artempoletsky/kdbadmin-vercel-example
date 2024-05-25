"use client";
import { useStoreUntyped, createStore } from "@artempoletsky/easystore";
import type { BreadcrumbsArray } from "./comp/Breadcrumbs";
import { useEffect } from "react";

export type Store = {
  breadcrumbs: BreadcrumbsArray | null;
  tableName: string;
  queryString: string;
};

createStore<Store>({
  breadcrumbs: null,
  tableName: "",
  queryString: "table.all()",
});

export function useStore<KeyT extends keyof Store>(key: KeyT) {
  return useStoreUntyped<Store, KeyT>(key);
}

export function useStoreEffectSet<KeyT extends keyof Store>(key: KeyT, value: Store[KeyT]) {
  const [, dispatch] = useStore(key);
  useEffect(() => {
    dispatch(value);
  }, [value]);
}