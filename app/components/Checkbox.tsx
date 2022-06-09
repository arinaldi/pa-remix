import { forwardRef } from "react";

interface Props {
  defaultValue?: boolean;
  id: string;
  label: string;
  wrapperClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ defaultValue, id, label, wrapperClassName = "" }, ref) => {
    return (
      <fieldset className={`flex items-center ${wrapperClassName}`}>
        <input
          className="h-4 w-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
          defaultChecked={defaultValue}
          id={id}
          name={id}
          ref={ref}
          type="checkbox"
        />
        <label
          className="ml-2 text-sm font-medium text-gray-700 dark:text-white"
          htmlFor={id}
        >
          {label}
        </label>
      </fieldset>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
