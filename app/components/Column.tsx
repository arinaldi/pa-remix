import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  wrapperClassName?: string;
}

export default function Column({ children, wrapperClassName = "" }: Props) {
  return (
    <th
      className={`px-3 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-white ${wrapperClassName}`}
      scope="col"
    >
      {children}
    </th>
  );
}
