import type { Song, TypedSupabaseClient } from "~/lib/db-types";

export async function getSongs(supabase: TypedSupabaseClient) {
  const { data: songs, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (songs) return songs;
  return [];
}

type SongInput = Omit<Song, "id" | "created_at">;

export async function createSong(
  supabase: TypedSupabaseClient,
  input: SongInput
) {
  const { error } = await supabase.from("songs").insert([input]);

  if (error) throw error;
  return true;
}

export async function deleteSong(supabase: TypedSupabaseClient, id: number) {
  const { error } = await supabase.from("songs").delete().eq("id", id);

  if (error) throw error;
  return true;
}
