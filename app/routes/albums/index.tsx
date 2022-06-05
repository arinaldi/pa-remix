import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArrowUpIcon } from "@heroicons/react/outline";

import { getFavorites } from "~/models/album.server";
import { formatFavorites, sortDesc } from "~/utils";
import Layout from "~/components/Layout";

type LoaderData = {
  favorites: Awaited<ReturnType<typeof getFavorites>>;
};

export async function loader() {
  return json<LoaderData>({
    favorites: await getFavorites(),
  });
}

export default function TopAlbums() {
  const { favorites } = useLoaderData<LoaderData>();

  return (
    <Layout
      title={
        <span>
          Top Albums
          <span className="ml-3 rounded-md bg-gray-100 p-1 text-xl font-semibold dark:bg-gray-700 sm:text-2xl">
            {favorites.length.toLocaleString()}
          </span>
        </span>
      }
    >
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(formatFavorites(favorites))
          .sort(sortDesc)
          .map(([year, data]) => (
            <div key={year}>
              <div className="flex items-center justify-between">
                <h4 id={year} className="text-xl font-semibold dark:text-white">
                  {year}
                </h4>
                <div className="mr-4 rounded-md bg-gray-100 px-2 py-1 text-xl font-semibold dark:bg-gray-700 dark:text-white">
                  {data.length.toLocaleString()}
                </div>
              </div>
              <ul className="ml-6 list-disc p-1">
                {data.map((album, index) => (
                  <li key={index} className="dark:text-white">
                    {album.artist} &ndash; {album.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
      <a
        className="fixed bottom-0 right-0 p-5 text-gray-500 dark:text-gray-200"
        href="#top"
      >
        <ArrowUpIcon className="mr-1 inline h-4 w-4" />
        <span>Top</span>
      </a>
    </Layout>
  );
}
