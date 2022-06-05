import type { User } from "@supabase/supabase-js";

import { supabase } from "~/lib/supabase";
import { supabaseToken } from "~/lib/supabase/cookie";

export const getToken = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");

  return await supabaseToken.parse(cookieHeader);
};

const getUserByToken = async (token: string) => {
  supabase.auth.setAuth(token);

  return await supabase.auth.api.getUser(token);
};

export async function getUser(request: Request): Promise<User | null> {
  const token = await getToken(request);

  if (!token) return null;

  const { error, user } = await getUserByToken(token);

  if (error) return null;

  return user;
}

// https://blog.openreplay.com/implementing-authentication-in-remix-applications-with-supabase
// https://codegino.com/blog/remix-supabase-auth
