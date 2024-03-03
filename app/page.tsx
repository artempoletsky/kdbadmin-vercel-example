import Link from "next/link";
import MainPage from "./MainPage";
import { Metadata } from "next";

import fs from "fs";
import { remark } from "remark";
import remarkHTML from "remark-html";

export const metadata: Metadata = {
  title: "Kurgan DB",
}

async function getReadmeHTML(): Promise<string> {
  const fullPath = process.cwd() + "/README.md";
  const fileContents = fs.readFileSync(fullPath, { encoding: "utf8" });

  const processedContent = await remark()
    .use(remarkHTML)
    .process(fileContents);
  const html = processedContent.toString();

  return html;
}

export default async function page() {
  const html = await getReadmeHTML();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Link className="underline bold text-slate-900 text-xl" href="/kurgandb/">To the admin panel</Link>
      <MainPage html={html} />
    </main>
  );
}
