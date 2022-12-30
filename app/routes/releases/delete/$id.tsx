import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { ActionArgs } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import createServerSupabase from "~/lib/supabase.server";
import { deleteRelease } from "~/models/release.server";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.id, "Release ID not found");

  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const id = parseInt(params.id);
  const success = await deleteRelease(supabase, id);

  if (success) {
    return redirect(ROUTE_HREF.NEW_RELEASES, { headers: response.headers });
  }

  return json(
    { errors: { submit: MESSAGES.ERROR } },
    { headers: response.headers, status: 500 }
  );
};
