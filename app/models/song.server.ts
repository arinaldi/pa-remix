import { supabase } from "~/lib/supabase";

export interface Song {
  id: number;
  created_at: string;
  artist: string;
  title: string;
  link: string;
}

export async function getSongs() {
  const { data: songs, error } = await supabase
    .from<Song>("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (songs) return songs;
  return [];
}

type SongInput = Omit<Song, "id" | "created_at">;

export async function createSong(input: SongInput) {
  const { error } = await supabase.from<Song>("songs").insert([input]);

  if (error) throw error;
  return true;
}

export async function deleteSong(id: number) {
  const { error } = await supabase.from("songs").delete().eq("id", id);

  if (error) throw error;
  return true;
}
