import React from "react";
import type { Option } from "../types/option";

export type DropdownProps = {
  value: string;
  options: Option[];
  id: string;
  name: string;
  onChange: (value: string) => void;
};

export const Dropdown = (props: DropdownProps) => {
  const { value, onChange, options, id, name } = props;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // @ts-ignore
    onChange(event.target.value);
  };

  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={handleChange}
        className="input input-bordered w-full"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 9.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 011.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <label htmlFor={id} className="block mb-2">
        {name}:
      </label>
    </div>
  );
};
