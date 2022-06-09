import Input from "~/components/Input";
import Modal from "~/components/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRelease({ isOpen, onClose }: Props) {
  return (
    <Modal
      action="/releases/create"
      isOpen={isOpen}
      method="post"
      onClose={onClose}
      title="Create Release"
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
            <Input id="date" type="date" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
