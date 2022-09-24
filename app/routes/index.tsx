import { redirect } from "@remix-run/node";

import { ROUTE_HREF } from "~/lib/constants";

export const loader = async () => {
  return redirect(ROUTE_HREF.TOP_ALBUMS);
};
