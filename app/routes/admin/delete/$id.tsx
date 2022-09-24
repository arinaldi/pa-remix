import { json, redirect } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";

import { MESSAGES, ROUTE_HREF, ROUTES_ADMIN } from "~/lib/constants";
import { getUser, setAuthToken } from "~/lib/supabase/auth";
import { deleteAlbum, getAlbum } from "~/models/album.server";
import CancelButton from "~/components/CancelButton";
import Layout from "~/components/Layout";
import SubmitButton from "~/components/SubmitButton";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    return redirect(ROUTE_HREF.TOP_ALBUMS);
  }

  invariant(params.id, "Album ID not found");

  const id = parseInt(params.id);
  const album = await getAlbum(id);

  return json({ album });
};

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.id, "Album ID not found");

  await setAuthToken(request);
  const id = parseInt(params.id);
  const success = await deleteAlbum(id);

  if (success) {
    const url = new URL(request.url);
    return redirect(`${ROUTES_ADMIN.base.href}${url.search}`);
  }

  return json({ errors: { submit: MESSAGES.ERROR } }, { status: 500 });
};

export default function DeleteAlbum() {
  const { album } = useLoaderData<typeof loader>();
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
