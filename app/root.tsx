import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type {
  HeadersFunction,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";

import useNProgress from "~/hooks/useNProgress";
import { getUser } from "~/lib/supabase/auth";
import Navbar from "~/components/Navbar";
import Toast from "~/components/Toast";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import nProgressStylesheetUrl from "~/styles/nprogress.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: nProgressStylesheetUrl },
    { rel: "icon", href: "https://fav.farm/💿" },
  ];
};

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "s-maxage=360, stale-while-revalidate=3600",
  };
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Perfect Albums",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  return json({ user });
};

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  useNProgress();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
        <script
          id="dark-mode"
          dangerouslySetInnerHTML={{
            __html: `
            const root = window.document.documentElement;
            const prefersDark = !('theme' in localStorage) &&
              window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (localStorage.theme === 'dark' || prefersDark) {
              root.classList.add('dark');
            } else {
              root.classList.remove('dark');
            }
          `,
          }}
        />
      </head>
      <body className="h-full dark:bg-gray-800">
        <Navbar user={user} />
        <Outlet />
        <Toast />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
