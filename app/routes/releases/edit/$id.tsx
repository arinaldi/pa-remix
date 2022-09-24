import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { ActionArgs } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import { setAuthToken } from "~/lib/supabase/auth";
import { editRelease } from "~/models/release.server";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.id, "Release ID not found");

  const formData = await request.formData();
  const artist = formData.get("artist");
  const title = formData.get("title");
  const date = formData.get("date");

  if (typeof artist !== "string" || artist.length === 0) {
    return json({ errors: { artist: "Artist is required" } }, { status: 400 });
  }

  if (typeof title !== "string" || title.length === 0) {
    return json({ errors: { title: "Title is required" } }, { status: 400 });
  }

  await setAuthToken(request);
  const id = parseInt(params.id);
  const success = await editRelease(id, {
    artist,
    date: typeof date === "string" && date.length ? date : null,
    title,
  });

  if (success) {
    return redirect(ROUTE_HREF.NEW_RELEASES);
  }

  return json({ errors: { submit: MESSAGES.ERROR } }, { status: 500 });
};
