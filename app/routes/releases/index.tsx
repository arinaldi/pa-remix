import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";

import type { LoaderFunction } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";

import { getUser } from "~/lib/supabase/auth";
import { getReleases } from "~/models/release.server";
import { formatReleases, sortByDate } from "~/utils";
import Layout from "~/components/Layout";

type LoaderData = {
  releases: Awaited<ReturnType<typeof getReleases>>;
  user: User | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const releases = await getReleases();
  const user = await getUser(request);

  return json<LoaderData>({ releases, user });
};

export default function NewReleases() {
  const { releases, user } = useLoaderData<LoaderData>();

  return (
    <Layout title="New Releases">
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
                          // onClick={() =>
                          //   setModal({
                          //     data: release,
                          //     type: MODAL_TYPES.NEW_RELEASE_EDIT,
                          //   })
                          // }
                        />
                        <TrashIcon
                          className="ml-2 inline h-4 w-4 cursor-pointer dark:text-white"
                          // onClick={() =>
                          //   setModal({
                          //     data: release,
                          //     type: MODAL_TYPES.NEW_RELEASE_DELETE,
                          //   })
                          // }
                        />
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </Layout>
  );
}
