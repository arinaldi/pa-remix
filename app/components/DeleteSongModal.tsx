import type { Song } from "~/models/song.server";

import Modal from "~/components/Modal";

interface Props {
  data: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteSongModal({ data, isOpen, onClose }: Props) {
  return (
    <Modal
      action={`/songs/delete/${data?.id}`}
      isOpen={isOpen}
      method="delete"
      onClose={onClose}
      title="Delete Song"
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
