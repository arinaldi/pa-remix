import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import { setAuthToken } from "~/lib/supabase/auth";
import { createSong } from "~/models/song.server";

type ActionData = {
  errors?: {
    artist?: string;
    title?: string;
    link?: string;
    submit?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const artist = formData.get("artist");
  const title = formData.get("title");
  const link = formData.get("link");

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

  if (typeof link !== "string" || !link.startsWith("http")) {
    return json<ActionData>(
      { errors: { title: "Link is invalid" } },
      { status: 400 }
    );
  }

  await setAuthToken(request);
  const success = await createSong({ artist, title, link });

  if (success) {
    return redirect(ROUTE_HREF.FEATURED_SONGS);
  }

  return json<ActionData>(
    { errors: { submit: MESSAGES.ERROR } },
    { status: 500 }
  );
};
