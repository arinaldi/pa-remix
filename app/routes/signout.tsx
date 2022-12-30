import { json, redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/server-runtime";

import { ROUTE_HREF } from "~/lib/constants";
import createServerSupabase from "~/lib/supabase.server";

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
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
