import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { ROUTE_HREF } from "~/lib/constants";

export const loader: LoaderFunction = async ({ request }) => {
  return redirect(ROUTE_HREF.TOP_ALBUMS);
};
