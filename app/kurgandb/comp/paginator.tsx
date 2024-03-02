
import { MouseEvent } from "react";
import css from "./paginator.module.css";

type Props = {
  page: number
  pagesCount: number
  span?: number
  onSetPage?: (page: number) => void
}

type PaginatorElement = {
  type: "page" | "gap" | "link"
  content: string
  link: string
  key: number
  page?: number
}
export default function Paginator({ page, pagesCount, span, onSetPage }: Props) {
  const elems: PaginatorElement[] = [];
  if (span === undefined) {
    span = 5;
  }
  let gapEnded = true;
  for (let i = 1; i <= pagesCount; i++) {
    if (Math.abs(i - page) < span || Math.abs(i - 1) < span || Math.abs(i - pagesCount) < span) {
      const el: PaginatorElement =
        i == page
          ? {
            key: i,
            type: "page",
            link: "",
            content: page + "",
            page: undefined,
          }
          : {
            key: i,
            type: "link",
            link: `./${i}`,
            content: i + "",
            page: i,
          };
      elems.push(el);
      gapEnded = true;
    } else {
      if (gapEnded) {
        elems.push({
          key: i,
          type: "gap",
          link: "",
          content: "...",
          page: undefined,
        });
        gapEnded = false;
      }
    }
  }

  function onLink(page: any) {
    return function (e: MouseEvent<HTMLAnchorElement>) {
      e.preventDefault();
      if (onSetPage)
        onSetPage(page);
    }
  }

  return <div className="my-3">
    {elems.map(el =>
    (el.link
      ? <a key={el.key} href="#" onClick={onLink(el.page)} className={css.link}>{el.content}</a>
      : <span key={el.key} className={el.type == "gap" ? css.gap : css.current}>{el.content}</span>)
    )}
  </div>
}