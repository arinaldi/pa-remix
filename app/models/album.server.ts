import type { PER_PAGE } from "~/lib/constants";

import { SORT_DIRECTION } from "~/lib/constants";
import { supabase } from "~/lib/supabase";

const { ASC, DESC } = SORT_DIRECTION;

export interface Album {
  id: number;
  created_at: string;
  artist: string;
  title: string;
  year: string;
  cd: boolean;
  favorite: boolean;
  studio: boolean;
}

export async function getCdCount() {
  const { count, error } = await supabase
    .from<Album>("albums")
    .select("*", { count: "exact", head: true })
    .eq("cd", true);

  if (error) throw error;
  if (count) return count;
  return 0;
}

export async function getFavorites() {
  const { data: favorites, error } = await supabase
    .from<Album>("albums")
    .select("*")
    .eq("favorite", true)
    .order("artist", { ascending: true });

  if (error) throw error;
  if (favorites) return favorites;
  return [];
}

interface Queries {
  artist: string;
  page: number;
  perPage: PER_PAGE;
  sort: string;
  studio: string;
  title: string;
}

export async function getAlbums(queries: Queries) {
  const { artist, page, perPage, sort, studio, title } = queries;
  const [sortProp, desc] = sort.split(":") ?? [];
  const direction = desc ? DESC : ASC;
  const start = (page - 1) * perPage;
  const end = page * perPage - 1;

  let query = supabase
    .from("albums")
    .select("*", { count: "exact" })
    .ilike("artist", `%${artist}%`)
    .ilike("title", `%${title}%`)
    .range(start, end);

  if (studio === "true") {
    query = query.eq("studio", true);
  }

  if (sortProp) {
    query = query.order(sortProp, { ascending: direction === ASC });
  } else {
    query = query
      .order("artist", { ascending: true })
      .order("title", { ascending: true });
  }

  if (sortProp === "artist") {
    query = query.order("title", { ascending: true });
  } else {
    query = query.order("artist", { ascending: direction === ASC });
  }

  const { data: albums, count, error } = await query;

  if (error) throw error;

  return {
    albums: albums || [],
    total: count || 0,
  };
}
