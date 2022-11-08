import type { SupabaseClient } from "@supabase/supabase-js";

export interface Release {
  id: number;
  created_at: string;
  artist: string;
  title: string;
  date: string | null;
}

export async function getReleases(supabase: SupabaseClient) {
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
  supabase: SupabaseClient,
  input: ReleaseInput
) {
  const { error } = await supabase.from("releases").insert([input]);

  if (error) throw error;
  return true;
}

export async function editRelease(
  supabase: SupabaseClient,
  id: number,
  input: ReleaseInput
) {
  const { error } = await supabase.from("releases").update(input).eq("id", id);

  if (error) throw error;
  return true;
}

export async function deleteRelease(supabase: SupabaseClient, id: number) {
  const { error } = await supabase.from("releases").delete().eq("id", id);

  if (error) throw error;
  return true;
}
