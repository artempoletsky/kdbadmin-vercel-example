"use client";


import css from "./markdown.module.css";


type Props = {
  html: string
};
export default function TestComponent(props: Props) {
  return (
    <div className={"border border-black bg-gray-300 rounded p-5 mt-5 " + css.markdown} dangerouslySetInnerHTML={{ __html: props.html }}></div>
  );
}