import { createServerClient } from "@supabase/auth-helpers-remix";

import type { Database } from "~/lib/db-types";

interface Args {
  request: Request;
  response: Response;
}

export default function supabase({ request, response }: Args) {
  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
}
