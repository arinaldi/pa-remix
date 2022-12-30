import { useEffect, useRef, useState } from "react";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
import {
  CheckIcon,
  DocumentPlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import type { FormEvent } from "react";
import type { LoaderFunction } from "@remix-run/node";
import type { Album } from "~/lib/db-types";

import {
  APP_MESSAGE_TYPES,
  PER_PAGE,
  ROUTE_HREF,
  ROUTES_ADMIN,
  SORT_VALUE,
} from "~/lib/constants";
import createServerSupabase from "~/lib/supabase.server";
import { parseQuery, parsePageQuery, parsePerPageQuery } from "~/lib/utils";
import { getAlbums, getCdCount } from "~/models/album.server";
import AppMessage from "~/components/AppMessage";
import Button from "~/components/Button";
import Column from "~/components/Column";
import Layout from "~/components/Layout";
import Pagination from "~/components/Pagination";
import PerPage from "~/components/PerPage";
import SortableColumn from "~/components/SortableColumn";
import SubmitButton from "~/components/SubmitButton";
import StudioFilter from "~/components/StudioFilter";

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return redirect(ROUTE_HREF.TOP_ALBUMS, { headers: response.headers });
  }

  const url = new URL(request.url);
  const { albums, total } = await getAlbums(supabase, {
    artist: parseQuery(url.searchParams.get("artist")),
    page: parsePageQuery(url.searchParams.get("page")),
    perPage: parsePerPageQuery(url.searchParams.get("perPage")),
    sort: parseQuery(url.searchParams.get("sort")),
    studio: parseQuery(url.searchParams.get("studio")),
    title: parseQuery(url.searchParams.get("title")),
  });

  return json(
    {
      albums,
      cdTotal: await getCdCount(supabase),
      total,
      version: process.env.APP_VERSION as string,
    },
    { headers: response.headers }
  );
};

interface Props {
  albums: Album[];
  cdTotal: number;
  total: number;
  version: string;
}

export default function Admin() {
  const { albums, cdTotal, total, version } = useLoaderData<Props>();
  const { search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const artistParam = parseQuery(searchParams.get("artist"));
  const titleParam = parseQuery(searchParams.get("title"));
  const perPage = parsePerPageQuery(searchParams.get("perPage"));
  const [artist, setArtist] = useState(artistParam);
  const [title, setTitle] = useState(titleParam);
  const artistRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    artistRef?.current?.focus();
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSearchParams({
      ...params,
      artist,
      page: "1",
      sort: SORT_VALUE.YEAR,
      title,
    });
  }

  function onClear() {
    setArtist("");
    setTitle("");
    artistRef?.current?.focus();
    setSearchParams({
      artist: "",
      page: "1",
      perPage: PER_PAGE.SMALL.toString(),
      sort: "",
      studio: "",
      title: "",
    });
  }

  const Title = (
    <>
      {ROUTES_ADMIN.base.label}
      <span className="ml-3 rounded-md bg-gray-100 px-1 text-xl font-semibold dark:bg-gray-700 sm:text-2xl">
        {total.toLocaleString()}
      </span>
    </>
  );

  const TitleAction = (
    <div className="flex items-center dark:text-white">
      <code className="mr-3">{version}</code>
      <span className="text-md mr-1 rounded-md bg-gray-100 px-1 font-semibold dark:bg-gray-700 sm:text-lg">
        {cdTotal.toLocaleString()}
      </span>
      <span className="mr-3">CDs</span>
      <Link
        className="rounded-md px-1.5 py-1 hover:bg-gray-200"
        to={`${ROUTES_ADMIN.create.href}${search}`}
      >
        <DocumentPlusIcon className="inline h-6 w-6 cursor-pointer dark:text-white" />
      </Link>
    </div>
  );
  return (
    <Layout title={Title} titleAction={TitleAction}>
      <form
        className="mb-4 block sm:flex sm:items-center sm:justify-between"
        onSubmit={onSubmit}
      >
        <input
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-black dark:bg-gray-700 dark:text-white sm:text-sm"
          id="artist-search"
          name="artist"
          onChange={(event) => setArtist(event.target.value)}
          placeholder="Search artist"
          ref={artistRef}
          type="text"
          value={artist}
        />
        <input
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-black dark:bg-gray-700 dark:text-white sm:ml-4 sm:mt-0 sm:text-sm"
          id="title-search"
          name="title"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Search title"
          type="text"
          value={title}
        />
        <div className="mt-2 flex justify-between sm:mt-0 sm:ml-4">
          <div className="flex">
            <SubmitButton isSubmitting={false} />
            <span className="ml-1" />
            <Button onClick={onClear}>Clear</Button>
          </div>
          <div className="inline sm:hidden">
            <StudioFilter />
          </div>
        </div>
      </form>

      <div className="mb-4 flex justify-center">
        <Pagination lastPage={Math.ceil(total / perPage)} />
        <div className="mx-2" />
        <PerPage />
        <div className="mx-2" />
        <div className="hidden sm:block">
          <StudioFilter />
        </div>
      </div>

      {albums.length === 0 ? (
        <AppMessage message="No results found" type={APP_MESSAGE_TYPES.INFO} />
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 dark:border-black sm:rounded-lg">
                <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-black sm:table-fixed">
                  <thead>
                    <tr>
                      <SortableColumn
                        prop="artist"
                        wrapperClassName="sm:w-1/4 sm:max-w-0"
                      >
                        Artist
                      </SortableColumn>
                      <SortableColumn
                        prop="title"
                        wrapperClassName="sm:w-1/3 sm:max-w-0"
                      >
                        Title
                      </SortableColumn>
                      <SortableColumn prop="year" wrapperClassName="sm:w-1/12">
                        Year
                      </SortableColumn>
                      <Column wrapperClassName="sm:w-1/12">Favorite</Column>
                      <Column wrapperClassName="sm:w-1/12">Actions</Column>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-black dark:bg-gray-500">
                    {albums.map(
                      ({ artist, cd, favorite, id, studio, title, year }) => (
                        <tr
                          key={id}
                          className="even:bg-gray-0 odd:bg-gray-100 dark:odd:bg-gray-700 dark:even:bg-gray-800"
                        >
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/4 sm:max-w-0 sm:truncate">
                            {artist}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/3 sm:max-w-0 sm:truncate">
                            {cd ? (
                              <span className="mr-1 text-xs">💿</span>
                            ) : null}
                            <span
                              className={
                                studio ? "font-medium italic" : "font-light"
                              }
                            >
                              {title}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/12">
                            {year}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/12">
                            {favorite ? (
                              <CheckIcon className="inline h-5 w-5" />
                            ) : null}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 dark:text-white sm:w-1/12">
                            <Link
                              className="rounded-md px-1.5 py-1 hover:bg-gray-200"
                              to={`${ROUTES_ADMIN.edit.href}/${id}${search}`}
                            >
                              <PencilIcon className="inline h-4 w-4 cursor-pointer dark:text-white" />
                            </Link>
                            <Link
                              className="ml-4 rounded-md px-1.5 py-1 hover:bg-gray-200"
                              to={`${ROUTES_ADMIN.delete.href}/${id}${search}`}
                            >
                              <TrashIcon className="inline h-4 w-4 cursor-pointer dark:text-white" />
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
