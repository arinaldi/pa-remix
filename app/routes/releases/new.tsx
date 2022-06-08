import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import { setAuthToken } from "~/lib/supabase/auth";
import { createRelease } from "~/models/release.server";

type ActionData = {
  errors?: {
    artist?: string;
    title?: string;
    date?: string;
    submit?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
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
  const success = await createRelease({ artist, date, title });

  if (success) {
    return redirect(ROUTE_HREF.NEW_RELEASES);
  }

  return json<ActionData>(
    { errors: { submit: MESSAGES.ERROR } },
    { status: 500 }
  );
};
