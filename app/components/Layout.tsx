import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  maxWidth?: string;
  title: ReactNode;
  titleAction?: ReactNode;
}

export default function Layout({
  children,
  maxWidth,
  title,
  titleAction,
}: Props) {
  return (
    <div className={`mx-auto p-4 ${maxWidth ?? "max-w-7xl"}`}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold dark:text-white sm:text-3xl">
          {title}
        </h1>
        {titleAction}
      </div>
      <main className="relative flex-auto">{children}</main>
    </div>
  );
}
