import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { ActionFunction } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import createServerSupabase from "~/lib/supabase.server";
import { deleteSong } from "~/models/song.server";

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.id, "Song ID not found");

  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const success = await deleteSong(supabase, parseInt(params.id));

  if (success) {
    return redirect(ROUTE_HREF.FEATURED_SONGS, { headers: response.headers });
  }

  return json(
    { errors: { submit: MESSAGES.ERROR } },
    { headers: response.headers, status: 500 }
  );
};
