import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { DocumentAddIcon, TrashIcon } from "@heroicons/react/outline";

import type { LoaderFunction } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";
import type { Song } from "~/models/song.server";

import { MODAL_TYPES } from "~/lib/constants";
import { getUser } from "~/lib/supabase/auth";
import { parseQuery } from "~/lib/utils";
import { getSongs } from "~/models/song.server";
import CreateSongModal from "~/components/CreateSongModal";
import DeleteSongModal from "~/components/DeleteSongModal";
import Layout from "~/components/Layout";

type LoaderData = {
  songs: Awaited<ReturnType<typeof getSongs>>;
  user: User | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const songs = await getSongs();
  const user = await getUser(request);

  return json<LoaderData>({ songs, user });
};

type ModalState = Song | null;

type ModalOpen =
  | { data?: null; type: MODAL_TYPES.CREATE }
  | { data: Song; type: MODAL_TYPES.DELETE };

export default function FeaturedSongs() {
  const { songs, user } = useLoaderData<LoaderData>();
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
          <span className="rounded-md px-1.5 py-1 hover:bg-gray-100">
            <DocumentAddIcon
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
                className="text-blue-600 dark:text-blue-500"
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

      <CreateSongModal isOpen={type === MODAL_TYPES.CREATE} onClose={onClose} />
      <DeleteSongModal
        data={modal}
        isOpen={type === MODAL_TYPES.DELETE}
        onClose={onClose}
      />
    </Layout>
  );
}
