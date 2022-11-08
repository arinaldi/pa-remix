import { json, redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import invariant from "tiny-invariant";

import type { ActionArgs } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import { deleteRelease } from "~/models/release.server";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.id, "Release ID not found");

  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
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
