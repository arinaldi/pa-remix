import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { ActionArgs } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import { setAuthToken } from "~/lib/supabase/auth";
import { deleteSong } from "~/models/song.server";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.id, "Song ID not found");

  await setAuthToken(request);
  const id = parseInt(params.id);
  const success = await deleteSong(id);

  if (success) {
    return redirect(ROUTE_HREF.FEATURED_SONGS);
  }

  return json({ errors: { submit: MESSAGES.ERROR } }, { status: 500 });
};
