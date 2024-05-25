"use client";

import NextLink, { LinkProps } from "next/link";
import { MouseEvent, MouseEventHandler, ReactNode } from "react";
import { ROOT_PATH } from "../generated";
import { useRouter } from "next/navigation";


const Invalidated = new Set<string>;

/**
 * Invalidates path for a comp/Link component
 * @param path - link's href 
 */
export function invalidate(path: string) {
  const href= "/" + ROOT_PATH + path;
  Invalidated.add(href);
  return href;
}


export default function Link(props: LinkProps & { className?: string, children: ReactNode, a?: boolean }) {

  let className = props.className || "";
  const href = props.href.toString();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (Invalidated.has(href)) {
      Invalidated.delete(href);
      e.preventDefault();
      window.location.href = href;
    }
  }
  return <NextLink onClick={onClick} href={href} className={className + " link"}>{props.children}</NextLink>
}