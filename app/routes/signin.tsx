import { useEffect } from "react";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import toast from "react-hot-toast";

import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";

import { ROUTE_HREF, ROUTES_ADMIN } from "~/lib/constants";
import { signIn } from "~/models/user.server";
import { getUser } from "~/lib/supabase/auth";
import { supabaseToken } from "~/lib/supabase/cookie";
import { isEmailValid } from "~/lib/utils";
import Input from "~/components/Input";
import Layout from "~/components/Layout";
import PasswordInput from "~/components/PasswordInput";
import SubmitButton from "~/components/SubmitButton";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (user) {
    return redirect(ROUTE_HREF.NEW_RELEASES);
  }

  return null;
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!isEmailValid(email)) {
    return json({ submit: "Email is invalid" });
  }

  if (typeof password !== "string" || password.length === 0) {
    return json({ submit: "Password is required" });
  }

  const { error, session } = await signIn(email, password);

  if (session) {
    return redirect(ROUTES_ADMIN.base.href, {
      headers: {
        "Set-Cookie": await supabaseToken.serialize(session.access_token, {
          expires: new Date(session.expires_at || ""),
          maxAge: session.expires_in,
        }),
      },
    });
  }

  if (error) {
    return json({ submit: "Invalid credentials" });
  }
};

export default function SignIn() {
  const errors = useActionData();
  const { state } = useTransition();

  useEffect(() => {
    if (errors?.submit) {
      toast.error(errors.submit);
    }
  }, [errors?.submit]);

  return (
    <Layout maxWidth="max-w-sm" title="Sign In">
      <Form method="post">
        <div className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <Input id="email" required type="email" wrapperClassName="mt-4" />
              <PasswordInput wrapperClassName="mt-4" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <SubmitButton isSubmitting={state === "submitting"} />
        </div>
      </Form>
    </Layout>
  );
}
