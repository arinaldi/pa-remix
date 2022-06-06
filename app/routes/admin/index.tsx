import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";

import type { LoaderFunction } from "@remix-run/node";

import { APP_MESSAGE_TYPES, ROUTE_HREF } from "~/lib/constants";
import { getUser } from "~/lib/supabase/auth";
import { parseQuery, parsePageQuery, parsePerPageQuery } from "~/lib/utils";
import { getAlbums } from "~/models/album.server";
import AppMessage from "~/components/AppMessage";
import Button from "~/components/Button";
import Column from "~/components/Column";
import Layout from "~/components/Layout";
import Pagination from "~/components/Pagination";
import PerPage from "~/components/PerPage";
import SortableColumn from "~/components/SortableColumn";
import StudioFilter from "~/components/StudioFilter";
import TableSkeleton from "~/components/TableSkeleton";

type LoaderData = Awaited<ReturnType<typeof getAlbums>>;

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) {
    return redirect(ROUTE_HREF.TOP_ALBUMS);
  }

  const url = new URL(request.url);
  const { albums, count } = await getAlbums({
    artist: "",
    page: parsePageQuery(url.searchParams.get("page")),
    perPage: parsePerPageQuery(url.searchParams.get("perPage")),
    sort: parseQuery(url.searchParams.get("sort")),
    studio: parseQuery(url.searchParams.get("studio")),
    title: "",
  });

  return json<LoaderData>({ albums, count });
};

export default function Admin() {
  const { albums, count } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const perPage = parsePerPageQuery(searchParams.get("perPage"));
  const isLoading = false;
  const cdTotal = 222;

  const Title = (
    <>
      Admin
      <span className="ml-3 rounded-md bg-gray-100 px-1 text-xl font-semibold dark:bg-gray-700 sm:text-2xl">
        {isLoading ? "—" : count.toLocaleString()}
      </span>
    </>
  );

  const AppVersion = (
    <div className="dark:text-white">
      <code className="mr-3">{`app version`}</code>
      <span className="text-md mr-1 rounded-md bg-gray-100 px-1 font-semibold dark:bg-gray-700 sm:text-lg">
        {/* {cdTotal === 0 ? "—" : cdTotal} */}
        {cdTotal}
      </span>
      CDs
    </div>
  );
  return (
    <Layout title={Title} titleAction={AppVersion}>
      <div className="mb-4 block sm:flex sm:items-center sm:justify-between">
        <input
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-black dark:bg-gray-700 dark:text-white sm:text-sm"
          id="artist-search"
          name="artist"
          // onChange={(event) => onSearch("artist", event.target.value)}
          placeholder="Search artist"
          // ref={artistRef}
          type="text"
          // value={artist}
        />
        <input
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-black dark:bg-gray-700 dark:text-white sm:ml-4 sm:mt-0 sm:text-sm"
          id="title-search"
          name="title"
          // onChange={(event) => onSearch("title", event.target.value)}
          placeholder="Search title"
          type="text"
          // value={title}
        />
        <div className="mt-2 flex justify-between sm:mt-0 sm:ml-4">
          <div className="flex">
            <Button onClick={() => {}}>Clear</Button>
            <span className="ml-1" />
            <Button onClick={() => {}}>New</Button>
          </div>
          <div className="inline sm:hidden">{/* <StudioFilter /> */}</div>
        </div>
      </div>

      <div className="mb-4 flex justify-center">
        <Pagination lastPage={Math.ceil(count / perPage)} />
        <div className="mx-2" />
        <PerPage />
        <div className="mx-2" />
        <div className="hidden sm:block">
          <StudioFilter />
        </div>
      </div>

      {albums.length === 0 && !isLoading ? (
        <AppMessage message="No results found" type={APP_MESSAGE_TYPES.INFO} />
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 dark:border-black sm:rounded-lg">
                <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-black sm:table-fixed">
                  <thead>
                    <tr>
                      <SortableColumn prop="artist">Artist</SortableColumn>
                      <SortableColumn prop="title">Title</SortableColumn>
                      <SortableColumn prop="year">Year</SortableColumn>
                      <Column>CD</Column>
                      <Column>Favorite</Column>
                      <Column>Actions</Column>
                    </tr>
                  </thead>
                  {isLoading ? (
                    <TableSkeleton />
                  ) : (
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-black dark:bg-gray-500">
                      {albums.map((album) => (
                        <tr
                          key={album.id}
                          className="even:bg-gray-0 odd:bg-gray-100 dark:odd:bg-gray-700 dark:even:bg-gray-800"
                        >
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/4 sm:max-w-0 sm:truncate">
                            {album.artist}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/4 sm:max-w-0 sm:truncate">
                            {album.studio ? <span>*</span> : null}
                            <span>{album.title}</span>
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/12">
                            {album.year}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/12">
                            {album.cd ? (
                              <CheckIcon className="inline h-5 w-5" />
                            ) : null}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/12">
                            {album.favorite ? (
                              <CheckIcon className="inline h-5 w-5" />
                            ) : null}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-auto">
                            <PencilIcon
                              className="inline h-4 w-4 cursor-pointer dark:text-white"
                              // onClick={() =>
                              //   onRouteChange(
                              //     `${ROUTES_ADMIN.edit.href}/${album.id}`
                              //   )
                              // }
                            />
                            <TrashIcon
                              className="ml-4 inline h-4 w-4 cursor-pointer dark:text-white"
                              // onClick={() =>
                              //   onRouteChange(
                              //     `${ROUTES_ADMIN.delete.href}/${album.id}`
                              //   )
                              // }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
