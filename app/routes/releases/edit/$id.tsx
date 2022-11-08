import { json, redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import invariant from "tiny-invariant";

import type { ActionFunction } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import { editRelease } from "~/models/release.server";

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.id, "Release ID not found");

  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
  const formData = await request.formData();
  const artist = formData.get("artist");
  const title = formData.get("title");
  const date = formData.get("date");

  if (typeof artist !== "string" || artist.length === 0) {
    return json(
      { errors: { artist: "Artist is required" } },
      { headers: response.headers, status: 400 }
    );
  }

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required" } },
      { headers: response.headers, status: 400 }
    );
  }

  const success = await editRelease(supabase, parseInt(params.id), {
    artist,
    date: typeof date === "string" && date.length ? date : null,
    title,
  });

  if (success) {
    return redirect(ROUTE_HREF.NEW_RELEASES, { headers: response.headers });
  }

  return json(
    { errors: { submit: MESSAGES.ERROR } },
    { headers: response.headers, status: 500 }
  );
};
