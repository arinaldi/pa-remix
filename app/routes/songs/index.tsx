import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { DocumentPlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import type { LoaderFunction } from "@remix-run/node";
import type { User } from "@supabase/auth-helpers-remix";
import type { Song } from "~/lib/db-types";

import { MODAL_TYPES } from "~/lib/constants";
import createServerSupabase from "~/lib/supabase.server";
import { parseQuery } from "~/lib/utils";
import { getSongs } from "~/models/song.server";
import CreateSong from "~/components/modals/CreateSong";
import DeleteSong from "~/components/modals/DeleteSong";
import Layout from "~/components/Layout";

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const songs = await getSongs(supabase);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json(
    {
      songs,
      user: session?.user,
    },
    {
      headers: response.headers,
    }
  );
};

type ModalState = Song | null;
type ModalOpen =
  | { data?: null; type: MODAL_TYPES.CREATE }
  | { data: Song; type: MODAL_TYPES.DELETE };

interface Props {
  songs: Song[];
  user: User | undefined;
}

export default function FeaturedSongs() {
  const { songs, user } = useLoaderData<Props>();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = parseQuery(searchParams.get("type"));
  const [modal, setModal] = useState<ModalState>(null);

  function onOpen({ data, type }: ModalOpen) {
    setSearchParams({ type });

    if (data) {
      setModal(data);
    }
  }

  function onClose() {
    setSearchParams({});
  }

  return (
    <Layout
      title="Featured Songs"
      titleAction={
        user ? (
          <span className="rounded-md px-1.5 py-1 hover:bg-gray-200">
            <DocumentPlusIcon
              className="inline h-6 w-6 cursor-pointer dark:text-white"
              onClick={() => onOpen({ type: MODAL_TYPES.CREATE })}
            />
          </span>
        ) : null
      }
    >
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {songs.map((song) => (
          <div
            className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-black dark:bg-gray-700"
            key={song.id}
          >
            <div className="mb-1 text-xl font-semibold dark:text-white">
              {song.title}
            </div>
            <div className="mb-2 text-gray-500 dark:text-white">
              {song.artist}
            </div>
            <div>
              <a
                className="text-blue-700 hover:underline dark:text-blue-500"
                href={song.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                Listen
              </a>
              {user ? (
                <span
                  className="ml-2 cursor-pointer dark:text-white"
                  onClick={() =>
                    onOpen({ data: song, type: MODAL_TYPES.DELETE })
                  }
                >
                  <TrashIcon className="inline h-4 w-4" />
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <CreateSong isOpen={type === MODAL_TYPES.CREATE} onClose={onClose} />
      <DeleteSong
        data={modal}
        isOpen={type === MODAL_TYPES.DELETE}
        onClose={onClose}
      />
    </Layout>
  );
}
