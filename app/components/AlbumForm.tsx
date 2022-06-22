import {
  Form,
  useLocation,
  useNavigate,
  useTransition,
} from "@remix-run/react";

import type { Album } from "~/models/album.server";

import { ROUTES_ADMIN } from "~/lib/constants";
import CancelButton from "~/components/CancelButton";
import Checkbox from "~/components/Checkbox";
import Input from "~/components/Input";
import SubmitButton from "~/components/SubmitButton";

interface Props {
  action: string;
  defaultValues?: Album;
  method: "post" | "put";
}

export default function AlbumForm({ action, defaultValues, method }: Props) {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { state } = useTransition();

  function onCancel() {
    navigate(`${ROUTES_ADMIN.base.href}${search}`);
  }

  return (
    <Form action={action} method={method}>
      <div className="bg-white p-6 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            defaultValue={defaultValues?.artist}
            id="artist"
            required
            type="text"
            wrapperClassName="order-1 sm:order-1"
          />
          <Input
            defaultValue={defaultValues?.title}
            id="title"
            required
            type="text"
            wrapperClassName="order-2 sm:order-3"
          />
          <Input
            defaultValue={
              defaultValues?.year || new Date().getFullYear().toString()
            }
            id="year"
            required
            type="text"
            wrapperClassName="order-3 sm:order-5"
          />
          <Checkbox
            defaultValue={defaultValues?.studio}
            id="studio"
            label="Studio Album"
            wrapperClassName="order-4 sm:order-2"
          />
          <Checkbox
            defaultValue={defaultValues?.cd}
            id="cd"
            label="CD"
            wrapperClassName="order-5 sm:order-4"
          />
          <Checkbox
            defaultValue={defaultValues?.favorite}
            id="favorite"
            label="Favorite"
            wrapperClassName="order-6 sm:order-6"
          />
        </div>
      </div>
      <div className="flex items-center justify-end p-6">
        <CancelButton onClick={onCancel} />
        <span className="ml-1" />
        <SubmitButton isSubmitting={state === "submitting"} />
      </div>
    </Form>
  );
}
