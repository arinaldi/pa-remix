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
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import useNProgress from "~/hooks/useNprogress";
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

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json<LoaderData>({ user });
};

export default function App() {
  const { user } = useLoaderData();
  useNProgress();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
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
