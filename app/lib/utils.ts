import type { Album } from "~/models/album.server";
import type { Release } from "~/models/release.server";

import { PER_PAGE } from "~/lib/constants";

export interface ListItem {
  artist: string;
  title: string;
  id?: number;
}

interface Results {
  [key: string]: ListItem[];
}

type Tuple = [string, ListItem[]];

export function formatFavorites(favorites: Album[]): Results {
  const results: Results = {};

  favorites.forEach(({ artist, title, year }) => {
    const data = { artist, title };

    if (results[year]) {
      results[year].push(data);
    } else {
      results[year] = [data];
    }
  });

  return results;
}

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatReleaseDate(isoString: string) {
  const newDate = new Date(isoString);
  const date = newDate.getUTCDate();
  const month = newDate.getUTCMonth();
  const year = newDate.getUTCFullYear();

  return `${date} ${MONTHS[month]} ${year}`;
}

interface ReleaseResults {
  [key: string]: Release[];
}

export function formatReleases(releases: Release[]): ReleaseResults {
  const results: ReleaseResults = {};

  releases.forEach((release) => {
    const releaseDate = release.date ? formatReleaseDate(release.date) : "TBD";

    if (results[releaseDate]) {
      results[releaseDate].push(release);
    } else {
      results[releaseDate] = [release];
    }
  });

  return results;
}

export function sortByDate(a: Tuple, b: Tuple): number {
  const dateA = a[0] === "TBD" ? a[0] : new Date(a[0]).toISOString();
  const dateB = b[0] === "TBD" ? b[0] : new Date(b[0]).toISOString();

  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  return 0;
}

export function sortDesc(a: Tuple, b: Tuple): number {
  return Number(b[0]) - Number(a[0]);
}

export function isEmailValid(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function parseQuery(value: string | null) {
  return typeof value === "string" ? value : "";
}

export function parsePageQuery(value: string | null) {
  return typeof value === "string" ? parseInt(value) : 1;
}

export function parsePerPageQuery(value: string | null) {
  const { SMALL, MEDIUM, LARGE } = PER_PAGE;
  const perPage = typeof value === "string" ? parseInt(value) : PER_PAGE.SMALL;

  if (perPage === SMALL) return SMALL;
  if (perPage === MEDIUM) return MEDIUM;
  if (perPage === LARGE) return LARGE;
  return SMALL;
}
