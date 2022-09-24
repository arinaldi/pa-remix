import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { ActionArgs } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import { setAuthToken } from "~/lib/supabase/auth";
import { deleteRelease } from "~/models/release.server";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.id, "Release ID not found");

  await setAuthToken(request);
  const id = parseInt(params.id);
  const success = await deleteRelease(id);

  if (success) {
    return redirect(ROUTE_HREF.NEW_RELEASES);
  }

  return json({ errors: { submit: MESSAGES.ERROR } }, { status: 500 });
};
