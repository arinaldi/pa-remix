import { forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

interface Props {
  wrapperClassName?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ wrapperClassName = "", ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={wrapperClassName}>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-white"
        >
          Password
        </label>
        <div className="relative">
          <input
            autoCapitalize="off"
            autoComplete="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-black dark:bg-gray-700 dark:text-white sm:text-sm"
            id="password"
            name="password"
            ref={ref}
            required
            type={showPassword ? "text" : "password"}
            {...rest}
          />
          <div
            aria-label="Show or hide password"
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
            onClick={() => setShowPassword((show) => !show)}
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeOffIcon className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;