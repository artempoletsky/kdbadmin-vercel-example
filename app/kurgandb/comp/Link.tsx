import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

export default function (props: LinkProps & { className?: string, children: ReactNode }) {

  let className = props.className || "";
  className += " underline text-blue-900";
  return <Link {...props} className={className}>{props.children}</Link>
}