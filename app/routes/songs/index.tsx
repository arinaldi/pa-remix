import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TrashIcon } from "@heroicons/react/outline";

import type { LoaderFunction } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";

import { getUser } from "~/lib/supabase/auth";
import { getSongs } from "~/models/song.server";
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

export default function FeaturedSongs() {
  const { songs, user } = useLoaderData<LoaderData>();

  return (
    <Layout title="Featured Songs">
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
                  // onClick={() =>
                  //   setModal({
                  //     data: song,
                  //     type: MODAL_TYPES.FEATURED_SONGS_DELETE,
                  //   })
                  // }
                >
                  <TrashIcon className="inline h-4 w-4" />
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
