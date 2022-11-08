import { json, redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import invariant from "tiny-invariant";

import type { ActionFunction } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import { deleteSong } from "~/models/song.server";

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.id, "Song ID not found");

  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
  const success = await deleteSong(supabase, parseInt(params.id));

  if (success) {
    return redirect(ROUTE_HREF.FEATURED_SONGS, { headers: response.headers });
  }

  return json(
    { errors: { submit: MESSAGES.ERROR } },
    { headers: response.headers, status: 500 }
  );
};
