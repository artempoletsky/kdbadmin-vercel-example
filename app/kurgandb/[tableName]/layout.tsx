"use client";
import { ReactNode, useContext, useEffect } from "react";
import Breadcrumbs from "../comp/Breadcrumbs";
import { useStore, useStoreEffectSet } from "../store";

type Props = {
  children: ReactNode;
  params: {
    tableName: string;
  }
}
export default function Layout({ params: { tableName }, children }: Props) {
  useStoreEffectSet("tableName", tableName);
  return children;
}