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
