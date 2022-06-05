import { createCookie } from "@remix-run/node";
import invariant from "tiny-invariant";

const SESSION_SECRET = process.env.SESSION_SECRET;

invariant(SESSION_SECRET, "SESSION_SECRET must be set");

export const supabaseToken = createCookie("sb:token", {
  httpOnly: true,
  maxAge: 604_800,
  sameSite: "lax",
  secrets: [SESSION_SECRET],
  secure: process.env.NODE_ENV === "production",
});
