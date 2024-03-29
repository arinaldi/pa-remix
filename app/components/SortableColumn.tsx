import { Link, useSearchParams } from "@remix-run/react";
import { ArrowLongDownIcon } from "@heroicons/react/24/outline";

import type { ReactNode } from "react";

import { parseQuery } from "~/lib/utils";

interface Props {
  children: ReactNode;
  prop: string;
  wrapperClassName?: string;
}

export default function SortableColumn({
  children,
  prop,
  wrapperClassName = "",
}: Props) {
  const [searchParams] = useSearchParams();
  const sort = parseQuery(searchParams.get("sort"));
  const params = Object.fromEntries(searchParams.entries());
  let [sortProp, desc] = sort.split(":") ?? [];
  let newSort = null;

  if (sortProp !== prop) {
    newSort = prop;
  } else if (sortProp === prop && !desc) {
    newSort = `${prop}:desc`;
  }

  const newSearchParams = new URLSearchParams({
    ...params,
    sort: newSort as string,
  });

  return (
    <th
      className={`cursor-pointer px-3 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-white ${wrapperClassName}`}
      scope="col"
    >
      <Link to={newSort ? `?${newSearchParams}` : "/admin"}>
        {children}
        <span
          className={`${
            sortProp === prop
              ? "text-gray-700 group-hover:bg-gray-300"
              : "invisible text-gray-400 group-hover:visible"
          } ml-1 flex-none`}
        >
          <ArrowLongDownIcon
            aria-hidden="true"
            className={`${desc ? "rotate-180" : ""} inline h-4 w-4`}
          />
        </span>
      </Link>
    </th>
  );
}
