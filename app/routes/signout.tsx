import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { MESSAGES } from "~/lib/constants";
import { supabase } from "~/lib/supabase";
import { getToken } from "~/lib/supabase/auth";
import { supabaseToken } from "~/lib/supabase/cookie";
import { ROUTE_HREF } from "~/lib/constants";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const token = await getToken(request);
    await supabase.auth.api.signOut(token);

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
