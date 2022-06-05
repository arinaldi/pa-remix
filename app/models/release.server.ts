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
