import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { ActionFunction } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import { setAuthToken } from "~/lib/supabase/auth";
import { editRelease } from "~/models/release.server";

type ActionData = {
  errors?: {
    artist?: string;
    title?: string;
    date?: string;
    submit?: string;
  };
};

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.id, "Release ID not found");

  const formData = await request.formData();
  const artist = formData.get("artist");
  const title = formData.get("title");
  const date = formData.get("date");

  if (typeof artist !== "string" || artist.length === 0) {
    return json<ActionData>(
      { errors: { artist: "Artist is required" } },
      { status: 400 }
    );
  }

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof date !== "string" || date.length === 0) {
    return json<ActionData>(
      { errors: { title: "Date is invalid" } },
      { status: 400 }
    );
  }

  await setAuthToken(request);
  const id = parseInt(params.id);
  const success = await editRelease(id, { artist, date, title });

  if (success) {
    return redirect(ROUTE_HREF.NEW_RELEASES);
  }

  return json<ActionData>(
    { errors: { submit: MESSAGES.ERROR } },
    { status: 500 }
  );
};
