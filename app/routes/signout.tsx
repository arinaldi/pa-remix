import { json, redirect } from "@remix-run/node";
import type { LoaderFunction, Request } from "@remix-run/node";

import { MESSAGES } from "~/lib/constants";
import { signOut } from "~/models/user.server";
import { supabaseToken } from "~/lib/supabase/cookie";
import { ROUTE_HREF } from "~/lib/constants";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    await signOut(request as Request);

    return redirect(ROUTE_HREF.TOP_ALBUMS, {
      headers: {
        "Set-Cookie": await supabaseToken.serialize("", {
          maxAge: 0,
        }),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : MESSAGES.ERROR;

    return json({ error: message }, { status: 500 });
  }
};
