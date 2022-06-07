import { useEffect, useRef } from "react";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import toast from "react-hot-toast";

import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";

import { ROUTE_HREF } from "~/lib/constants";
import { supabase } from "~/lib/supabase";
import { getUser } from "~/lib/supabase/auth";
import { supabaseToken } from "~/lib/supabase/cookie";
import { isEmailValid } from "~/lib/utils";
import Input from "~/components/Input";
import Layout from "~/components/Layout";
import PasswordInput from "~/components/PasswordInput";
import SubmitButton from "~/components/SubmitButton";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (user) {
    return redirect(ROUTE_HREF.NEW_RELEASES);
  }

  return null;
};

type ActionData = {
  errors?: {
    email?: string;
    password?: string;
    submit?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!isEmailValid(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  const { error, session } = await supabase.auth.signIn({ email, password });

  if (session) {
    return redirect(ROUTE_HREF.NEW_RELEASES, {
      headers: {
        "Set-Cookie": await supabaseToken.serialize(session.access_token, {
          expires: new Date(session.expires_at || ""),
          maxAge: session.expires_in,
        }),
      },
    });
  }

  if (error) {
    return json<ActionData>(
      { errors: { submit: "Invalid credentials" } },
      { status: 401 }
    );
  }
};

export default function SignIn() {
  const actionData = useActionData() as ActionData;
  const transition = useTransition();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  useEffect(() => {
    if (actionData?.errors?.submit) {
      toast.error(actionData.errors.submit);
    }
  }, [actionData]);

  return (
    <Layout maxWidth="max-w-sm" title="Sign In">
      <Form method="post">
        <div className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <Input
                id="email"
                ref={emailRef}
                required
                type="email"
                wrapperClassName="mt-4"
              />
              <PasswordInput ref={passwordRef} wrapperClassName="mt-4" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <SubmitButton isSubmitting={transition.state !== "idle"} />
        </div>
      </Form>
    </Layout>
  );
}
