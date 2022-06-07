import type { User } from "@supabase/supabase-js";

import { supabase } from "~/lib/supabase";
import { supabaseToken } from "~/lib/supabase/cookie";

// https://blog.openreplay.com/implementing-authentication-in-remix-applications-with-supabase

export async function getToken(request: Request) {
  const cookieHeader = request.headers.get("Cookie");

  return await supabaseToken.parse(cookieHeader);
}

export async function getUserByToken(token: string) {
  supabase.auth.setAuth(token);

  return await supabase.auth.api.getUser(token);
}

export async function getUser(request: Request): Promise<User | null> {
  const token = await getToken(request);

  if (!token) return null;

  const { error, user } = await getUserByToken(token);

  if (error) return null;

  return user;
}

// https://codegino.com/blog/remix-supabase-auth

export async function setAuthToken(request: Request) {
  const token = await getToken(request);

  supabase.auth.setAuth(token);
}
