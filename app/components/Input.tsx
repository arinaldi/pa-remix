import { forwardRef } from "react";

interface Props {
  defaultValue?: string;
  id: string;
  required?: boolean;
  type: "text" | "date" | "email";
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ defaultValue, id, required, type, wrapperClassName = "" }, ref) => {
    return (
      <div className={wrapperClassName}>
        <label
          htmlFor={id}
          className="block text-sm font-medium capitalize text-gray-700 dark:text-white"
        >
          {id}
        </label>
        <input
          autoCapitalize={id === "email" ? "off" : "on"}
          autoComplete={id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-black dark:bg-gray-700 dark:text-white sm:text-sm"
          defaultValue={defaultValue}
          enterKeyHint="enter"
          id={id}
          name={id}
          ref={ref}
          required={required}
          type={type}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
