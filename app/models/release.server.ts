import type { Release, TypedSupabaseClient } from "~/lib/db-types";

export async function getReleases(supabase: TypedSupabaseClient) {
  const { data: releases, error } = await supabase
    .from("releases")
    .select("*")
    .order("artist", { ascending: true });

  if (error) throw error;
  if (releases) return releases;
  return [];
}

type ReleaseInput = Omit<Release, "id" | "created_at">;

export async function createRelease(
  supabase: TypedSupabaseClient,
  input: ReleaseInput
) {
  const { error } = await supabase.from("releases").insert([input]);

  if (error) throw error;
  return true;
}

export async function editRelease(
  supabase: TypedSupabaseClient,
  id: number,
  input: ReleaseInput
) {
  const { error } = await supabase.from("releases").update(input).eq("id", id);

  if (error) throw error;
  return true;
}

export async function deleteRelease(supabase: TypedSupabaseClient, id: number) {
  const { error } = await supabase.from("releases").delete().eq("id", id);

  if (error) throw error;
  return true;
}
