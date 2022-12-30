import { json, redirect } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF, ROUTES_ADMIN } from "~/lib/constants";
import createServerSupabase from "~/lib/supabase.server";
import { createAlbum } from "~/models/album.server";
import AlbumForm from "~/components/AlbumForm";
import Layout from "~/components/Layout";

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return redirect(ROUTE_HREF.TOP_ALBUMS, { headers: response.headers });
  }

  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const formData = await request.formData();
  const artist = formData.get("artist");
  const title = formData.get("title");
  const year = formData.get("year");
  const cd = formData.get("cd");
  const favorite = formData.get("favorite");
  const studio = formData.get("studio");

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

  if (typeof year !== "string" || year.length === 0) {
    return json(
      { errors: { title: "Year is invalid" } },
      { headers: response.headers, status: 400 }
    );
  }

  const success = await createAlbum(supabase, {
    artist,
    title,
    year,
    cd: cd === "on",
    favorite: favorite === "on",
    studio: studio === "on",
  });

  if (success) {
    const url = new URL(request.url);
    return redirect(`${ROUTES_ADMIN.base.href}${url.search}`, {
      headers: response.headers,
    });
  }

  return json(
    { errors: { submit: MESSAGES.ERROR } },
    { headers: response.headers, status: 500 }
  );
};

export default function CreateAlbum() {
  const { search } = useLocation();

  return (
    <Layout title={ROUTES_ADMIN.create.label}>
      <AlbumForm
        action={`${ROUTES_ADMIN.create.href}${search}`}
        method="post"
      />
    </Layout>
  );
}
