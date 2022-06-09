import Input from "~/components/Input";
import Modal from "~/components/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSong({ isOpen, onClose }: Props) {
  return (
    <Modal
      action="/songs/create"
      isOpen={isOpen}
      method="post"
      onClose={onClose}
      title="Create Song"
    >
      <div className="bg-white p-6 dark:bg-gray-800">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6">
            <Input id="artist" required type="text" />
          </div>
          <div className="col-span-6">
            <Input id="title" required type="text" />
          </div>
          <div className="col-span-6">
            <Input id="link" required type="text" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
