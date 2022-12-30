import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF } from "~/lib/constants";
import createServerSupabase from "~/lib/supabase.server";
import { createSong } from "~/models/song.server";

export const action: ActionFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const formData = await request.formData();
  const artist = formData.get("artist");
  const title = formData.get("title");
  const link = formData.get("link");

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

  if (typeof link !== "string" || !link.startsWith("http")) {
    return json(
      { errors: { title: "Link is invalid" } },
      { headers: response.headers, status: 400 }
    );
  }

  const success = await createSong(supabase, { artist, title, link });

  if (success) {
    return redirect(ROUTE_HREF.FEATURED_SONGS, { headers: response.headers });
  }

  return json(
    { errors: { submit: MESSAGES.ERROR } },
    { headers: response.headers, status: 500 }
  );
};
