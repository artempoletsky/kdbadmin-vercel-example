import NextLink, { LinkProps } from "next/link";
import { ReactNode } from "react";

export default function Link(props: LinkProps & { className?: string, children: ReactNode }) {

  let className = props.className || "";
  className += " underline text-blue-900";
  return <NextLink {...props} className={className}>{props.children}</NextLink>
}