import { json, redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";

import type { LoaderFunction } from "@remix-run/server-runtime";

import { ROUTE_HREF } from "~/lib/constants";

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
  const { error } = await supabase.auth.signOut();

  if (error) {
    return json(
      { error },
      {
        headers: response.headers,
      }
    );
  } else {
    return redirect(ROUTE_HREF.TOP_ALBUMS, {
      headers: response.headers,
    });
  }
};
