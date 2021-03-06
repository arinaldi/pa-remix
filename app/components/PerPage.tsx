import { useSearchParams } from "@remix-run/react";

import { PER_PAGE } from "~/lib/constants";
import { parsePerPageQuery } from "~/lib/utils";

const { SMALL, MEDIUM, LARGE } = PER_PAGE;

interface Props {
  prop: PER_PAGE;
}

function Button({ prop }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const perPage = parsePerPageQuery(searchParams.get("perPage"));
  const params = Object.fromEntries(searchParams.entries());

  function onClick() {
    setSearchParams({
      ...params,
      page: "1",
      perPage: prop.toString(),
    });
  }

  return (
    <button
      className={`${prop === SMALL ? "rounded-l-md" : ""} ${
        prop === LARGE ? "rounded-r-md" : ""
      } relative inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-black dark:bg-gray-700 dark:text-white`}
      disabled={perPage === prop}
      onClick={onClick}
    >
      <span className="sr-only">{prop}</span>
      {prop}
    </button>
  );
}

export default function PerPage() {
  return (
    <nav
      className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
      aria-label="Pagination"
    >
      <Button prop={SMALL} />
      <Button prop={MEDIUM} />
      <Button prop={LARGE} />
    </nav>
  );
}
