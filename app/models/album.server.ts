import type { Album, AlbumColumn, TypedSupabaseClient } from "~/lib/db-types";

import type { PER_PAGE } from "~/lib/constants";

import { SORT_DIRECTION } from "~/lib/constants";

const { ASC, DESC } = SORT_DIRECTION;

type AlbumInput = Omit<Album, "id" | "created_at">;

export async function createAlbum(
  supabase: TypedSupabaseClient,
  input: AlbumInput
) {
  const { error } = await supabase.from("albums").insert([input]);

  if (error) throw error;
  return true;
}

export async function editAlbum(
  supabase: TypedSupabaseClient,
  id: number,
  input: AlbumInput
) {
  const { error } = await supabase.from("albums").update(input).eq("id", id);

  if (error) throw error;
  return true;
}

export async function deleteAlbum(supabase: TypedSupabaseClient, id: number) {
  const { error } = await supabase.from("albums").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function getCdCount(supabase: TypedSupabaseClient) {
  const { count, error } = await supabase
    .from("albums")
    .select("*", { count: "exact", head: true })
    .eq("cd", true);

  if (error) throw error;
  if (count) return count;
  return 0;
}

export async function getFavorites(supabase: TypedSupabaseClient) {
  const { data: favorites, error } = await supabase
    .from("albums")
    .select("*")
    .eq("favorite", true)
    .order("artist", { ascending: true });

  if (error) throw error;
  if (favorites) return favorites;
  return [];
}

export async function getAlbum(supabase: TypedSupabaseClient, id: number) {
  const { data: album, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return album;
}

interface Queries {
  artist: string;
  page: number;
  perPage: PER_PAGE;
  sort: string;
  studio: string;
  title: string;
}

export async function getAlbums(
  supabase: TypedSupabaseClient,
  queries: Queries
) {
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
    query = query.order(sortProp as AlbumColumn, {
      ascending: direction === ASC,
    });
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
