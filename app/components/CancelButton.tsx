import { forwardRef } from "react";

interface Props {
  onClick: () => void;
}

const CancelButton = forwardRef<HTMLButtonElement, Props>(
  ({ onClick }, ref) => {
    return (
      <button
        className="background-transparent rounded px-6 py-3 text-sm font-bold uppercase text-red-500 hover:bg-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        onClick={onClick}
        ref={ref}
        type="button"
      >
        Cancel
      </button>
    );
  }
);

CancelButton.displayName = "CancelButton";

export default CancelButton;
