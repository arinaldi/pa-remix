import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Column({ children }: Props) {
  return (
    <th
      className="px-3 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-white sm:w-1/12"
      scope="col"
    >
      {children}
    </th>
  );
}
