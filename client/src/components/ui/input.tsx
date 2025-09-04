import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: FieldError | string;
  registration?: Partial<UseFormRegisterReturn>;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      description,
      error,
      type = "text",
      className = "",
      registration,
      ...props
    },
    ref
  ) => {
    const errorMessage = error
      ? typeof error === "string"
        ? error
        : error.message
      : undefined;

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label
            htmlFor={name}
            className="text-sm text-jsblack font-semibold leading-[140%] font-inter"
          >
            {label}
          </label>
        )}

        {description && (
          <span className="text-base text-[#757575] font-normal leading-[140%] font-inter">
            {description}
          </span>
        )}

        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          className={`
          w-full
          h-10
          px-4
          py-3
          bg-white
          border
          border-[#D9D9D9]
          rounded-lg
          text-sm text-jsblack font-semibold
          leading-none
          font-inter
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${errorMessage ? "border-red-500" : ""}
          ${className}
        `}
          {...registration}
          {...props}
        />

        {errorMessage && (
          <span className="text-base text-red-500 font-normal leading-[140%] font-inter">
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
