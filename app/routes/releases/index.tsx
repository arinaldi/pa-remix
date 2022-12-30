import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import {
  DocumentPlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import type { LoaderFunction } from "@remix-run/node";
import type { User } from "@supabase/auth-helpers-remix";
import type { Release } from "~/lib/db-types";

import { MODAL_TYPES } from "~/lib/constants";
import createServerSupabase from "~/lib/supabase.server";
import { formatReleases, parseQuery, sortByDate } from "~/lib/utils";
import { getReleases } from "~/models/release.server";
import CreateRelease from "~/components/modals/CreateRelease";
import DeleteRelease from "~/components/modals/DeleteRelease";
import EditRelease from "~/components/modals/EditRelease";
import Layout from "~/components/Layout";

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const releases = await getReleases(supabase);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json(
    {
      releases,
      user: session?.user,
    },
    {
      headers: response.headers,
    }
  );
};

type ModalState = Release | null;
type ModalOpen =
  | { data?: null; type: MODAL_TYPES.CREATE }
  | { data: Release; type: MODAL_TYPES.DELETE | MODAL_TYPES.EDIT };

interface Props {
  releases: Release[];
  user: User | undefined;
}

export default function NewReleases() {
  const { releases, user } = useLoaderData<Props>();
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
      title="New Releases"
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
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(formatReleases(releases))
          .sort(sortByDate)
          .map(([date, data]) => (
            <div key={date}>
              <h4 className="text-xl font-semibold dark:text-white">{date}</h4>
              <ul className="ml-6 list-disc p-1">
                {data.map((release) => (
                  <li key={release.id} className="dark:text-white">
                    <span>
                      {release.artist} &ndash; {release.title}
                    </span>
                    {user && (
                      <>
                        <PencilIcon
                          className="ml-2 inline h-4 w-4 cursor-pointer dark:text-white"
                          onClick={() =>
                            onOpen({
                              data: release,
                              type: MODAL_TYPES.EDIT,
                            })
                          }
                        />
                        <TrashIcon
                          className="ml-2 inline h-4 w-4 cursor-pointer dark:text-white"
                          onClick={() =>
                            onOpen({
                              data: release,
                              type: MODAL_TYPES.DELETE,
                            })
                          }
                        />
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      <CreateRelease isOpen={type === MODAL_TYPES.CREATE} onClose={onClose} />
      <DeleteRelease
        data={modal}
        isOpen={type === MODAL_TYPES.DELETE}
        onClose={onClose}
      />
      <EditRelease
        data={modal}
        isOpen={type === MODAL_TYPES.EDIT}
        onClose={onClose}
      />
    </Layout>
  );
}
