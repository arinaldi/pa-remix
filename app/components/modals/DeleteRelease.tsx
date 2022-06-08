import type { Release } from "~/models/release.server";

import Modal from "~/components/Modal";

interface Props {
  data: Release | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteRelease({ data, isOpen, onClose }: Props) {
  return (
    <Modal
      action={`/releases/delete/${data?.id}`}
      isOpen={isOpen}
      method="delete"
      onClose={onClose}
      title="Delete Release"
    >
      <div className="bg-white p-6 dark:bg-gray-800">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 dark:text-white">
            Are you sure you want to delete {data?.artist} &ndash; {data?.title}
            ?
          </div>
        </div>
      </div>
    </Modal>
  );
}
