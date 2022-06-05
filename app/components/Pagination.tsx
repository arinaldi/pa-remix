import { useSearchParams } from "@remix-run/react";

import type { ReactNode } from "react";

import { parsePageQuery } from "~/lib/utils";

enum PAGE {
  FIRST = "First page",
  LAST = "Last page",
  NEXT = "Next page",
  PREVIOUS = "Previous page",
}

interface PaginationProps {
  lastPage: number;
}

interface ButtonProps {
  children: ReactNode;
  isDisabled: boolean;
  label: PAGE;
  pageValue: number;
}

function Button({ children, isDisabled, label, pageValue }: ButtonProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  function onClick() {
    setSearchParams({
      ...params,
      page: pageValue.toString(),
    });
  }

  return (
    <button
      className={`${label === PAGE.FIRST ? "rounded-l-md" : ""} ${
        label === PAGE.LAST ? "rounded-r-md" : ""
      } relative inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-black dark:bg-gray-700 dark:text-white`}
      disabled={isDisabled}
      onClick={onClick}
    >
      <span className="sr-only">{label}</span>
      {children}
    </button>
  );
}

export default function Pagination({ lastPage }: PaginationProps) {
  const [searchParams] = useSearchParams();
  const page = parsePageQuery(searchParams.get("page"));
  const isFirstPage = page === 1;
  const isLastPage = page === lastPage;

  return (
    <nav
      className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
      aria-label="Pagination"
    >
      <Button isDisabled={isFirstPage} label={PAGE.FIRST} pageValue={1}>
        «
      </Button>
      <Button
        isDisabled={isFirstPage}
        label={PAGE.PREVIOUS}
        pageValue={page - 1}
      >
        ‹
      </Button>
      <span className="relative inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 dark:border-black dark:bg-gray-700 dark:text-white">
        {page}
      </span>
      <Button isDisabled={isLastPage} label={PAGE.NEXT} pageValue={page + 1}>
        ›
      </Button>
      <Button isDisabled={isLastPage} label={PAGE.LAST} pageValue={lastPage}>
        »
      </Button>
    </nav>
  );
}
