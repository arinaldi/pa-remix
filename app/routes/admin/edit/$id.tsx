import { json, redirect } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import invariant from "tiny-invariant";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { Album } from "~/models/album.server";

import { MESSAGES, ROUTE_HREF, ROUTES_ADMIN } from "~/lib/constants";
import { editAlbum, getAlbum } from "~/models/album.server";
import AlbumForm from "~/components/AlbumForm";
import Layout from "~/components/Layout";

export const loader: LoaderFunction = async ({ params, request }) => {
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return redirect(ROUTE_HREF.TOP_ALBUMS, { headers: response.headers });
  }

  invariant(params.id, "Album ID not found");

  const album = await getAlbum(supabase, parseInt(params.id));

  return json({ album }, { headers: response.headers });
};

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.id, "Album ID not found");

  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
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

  const id = parseInt(params.id as string);
  const success = await editAlbum(supabase, id, {
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

interface Props {
  album: Album;
}

export default function EditAlbum() {
  const { album } = useLoaderData<Props>();
  const { pathname, search } = useLocation();

  return (
    <Layout title={ROUTES_ADMIN.edit.label}>
      <AlbumForm
        action={`${pathname}/${search}`}
        defaultValues={album}
        method="put"
      />
    </Layout>
  );
}
