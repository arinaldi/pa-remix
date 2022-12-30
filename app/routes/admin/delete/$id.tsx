import { json, redirect } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { Album } from "~/lib/db-types";

import { MESSAGES, ROUTE_HREF, ROUTES_ADMIN } from "~/lib/constants";
import createServerSupabase from "~/lib/supabase.server";
import { deleteAlbum, getAlbum } from "~/models/album.server";
import CancelButton from "~/components/CancelButton";
import Layout from "~/components/Layout";
import SubmitButton from "~/components/SubmitButton";

export const loader: LoaderFunction = async ({ params, request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
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
  const supabase = createServerSupabase({ request, response });
  const success = await deleteAlbum(supabase, parseInt(params.id));

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

export default function DeleteAlbum() {
  const { album } = useLoaderData<Props>();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { state } = useTransition();

  function onCancel() {
    navigate(`${ROUTES_ADMIN.base.href}${search}`);
  }

  return (
    <Layout title={ROUTES_ADMIN.delete.label}>
      <div className="relative flex-auto">
        <div className="bg-white p-6 dark:bg-gray-800 dark:text-white">
          Are you sure you want to delete {album.artist} – {album.title}?
        </div>
        <Form
          action={`${pathname}/${search}`}
          className="flex items-center justify-end p-6"
          method="delete"
        >
          <CancelButton onClick={onCancel} />
          <span className="ml-1" />
          <SubmitButton isSubmitting={state === "submitting"} />
        </Form>
      </div>
    </Layout>
  );
}
