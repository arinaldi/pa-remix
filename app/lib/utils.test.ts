import { isEmailValid } from "~/lib/utils";

test("isEmailValid returns false for non-emails", () => {
  expect(isEmailValid(undefined)).toBe(false);
  expect(isEmailValid(null)).toBe(false);
  expect(isEmailValid("")).toBe(false);
  expect(isEmailValid("not-an-email")).toBe(false);
  expect(isEmailValid("n@")).toBe(false);
});

test("isEmailValid returns true for emails", () => {
  expect(isEmailValid("test@example.com")).toBe(true);
});
