import type { Request } from "@remix-run/node";

import { supabase } from "~/lib/supabase";
import { getToken } from "~/lib/supabase/auth";

export async function signIn(email: string, password: string) {
  return await supabase.auth.signIn({ email, password });
}

export async function signOut(request: Request) {
  const token = await getToken(request);
  await supabase.auth.api.signOut(token);
}
