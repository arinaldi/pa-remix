import type { SupabaseClient } from "@supabase/supabase-js";

export interface Song {
  id: number;
  created_at: string;
  artist: string;
  title: string;
  link: string;
}

export async function getSongs(supabase: SupabaseClient) {
  const { data: songs, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (songs) return songs;
  return [];
}

type SongInput = Omit<Song, "id" | "created_at">;

export async function createSong(supabase: SupabaseClient, input: SongInput) {
  const { error } = await supabase.from("songs").insert([input]);

  if (error) throw error;
  return true;
}

export async function deleteSong(supabase: SupabaseClient, id: number) {
  const { error } = await supabase.from("songs").delete().eq("id", id);

  if (error) throw error;
  return true;
}
