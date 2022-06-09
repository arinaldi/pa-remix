import { supabase } from "~/lib/supabase";

export interface Release {
  id: number;
  created_at: string;
  artist: string;
  title: string;
  date: string | null;
}

export async function getReleases() {
  const { data: releases, error } = await supabase
    .from<Release>("releases")
    .select("*")
    .order("artist", { ascending: true });

  if (error) throw error;
  if (releases) return releases;
  return [];
}

type ReleaseInput = Omit<Release, "id" | "created_at">;

export async function createRelease(input: ReleaseInput) {
  const { error } = await supabase.from<Release>("releases").insert([input]);

  if (error) throw error;
  return true;
}

export async function editRelease(id: number, input: ReleaseInput) {
  const { error } = await supabase
    .from<Release>("releases")
    .update(input)
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function deleteRelease(id: number) {
  const { error } = await supabase
    .from<Release>("releases")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
