import { redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";

import { ROUTE_HREF } from "~/lib/constants";
import { getUser } from "~/lib/supabase/auth";
import Layout from "~/components/Layout";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) {
    return redirect(ROUTE_HREF.TOP_ALBUMS);
  }

  return null;
};

export default function Admin() {
  const isLoading = false;
  const total = 4321;
  const cdTotal = 222;

  const Title = (
    <>
      Admin
      <span className="ml-3 rounded-md bg-gray-100 px-1 text-xl font-semibold dark:bg-gray-700 sm:text-2xl">
        {isLoading ? "—" : total.toLocaleString()}
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
      placeholder
    </Layout>
  );
}
