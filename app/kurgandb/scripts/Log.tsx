import { useEffect, useRef } from "react"
import type { ScriptsLogRecord } from "../api/methods";

type Props = {
  log: ScriptsLogRecord[]
}

export default function Log({ log }: Props) {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const cont = scrollContainerRef.current;
    if (!cont) throw new Error("container is undefined");
    cont.scrollTo(0, cont.scrollHeight);
  }, [log.length, log]);

  return <div className="mt-3">
    <p className="mb-3">Output:</p>
    <ul ref={scrollContainerRef} className="overflow-y-scroll max-w-[750px] h-[150px] bg-slate-700 text-gray-300 rounded">
      {log.map((el, i) => <li key={i} className="flex px-1">
        <div className="grow">{el.result}</div>
        {el.time != -1 && <div className="">{el.time}ms</div>}
      </li>)}
    </ul>
  </div>
}