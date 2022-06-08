import type { Release } from "~/models/release.server";

import { formatDate } from "~/lib/utils";
import Input from "~/components/Input";
import Modal from "~/components/Modal";

interface Props {
  data: Release | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditRelease({ data, isOpen, onClose }: Props) {
  return (
    <Modal
      action={`/releases/edit/${data?.id}`}
      isOpen={isOpen}
      method="put"
      onClose={onClose}
      title="Edit Release"
    >
      <div className="bg-white p-6 dark:bg-gray-800">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6">
            <Input
              defaultValue={data?.artist}
              id="artist"
              required
              type="text"
            />
          </div>
          <div className="col-span-6">
            <Input defaultValue={data?.title} id="title" required type="text" />
          </div>
          <div className="col-span-6">
            <Input
              defaultValue={formatDate(data?.date || "")}
              id="date"
              required
              type="date"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
