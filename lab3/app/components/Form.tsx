import React from "react";

function Form({ children, className, onSubmit }: { children; className?: string; onSubmit?: (e) => void }) {
  return <form className={`${className}`} onSubmit={onSubmit}>{children}</form>;
}

function Body({ children }) {
  return (
    <div className="flex flex-col gap-0.5 px-7 py-6 rounded-3xl">
      {children}
    </div>
  );
}

interface InputProps {
  id: string;
  placeholder?: string;
  label?: string;
  type?: string;
  containerClasses?: string;
  value?: string | number;
  onChange?: (e) => void;
  required?: boolean;
  step?: string | number;
  ref: any;
  defaultValue?: string | number;
}

function Input({
  id,
  placeholder,
  label,
  type = "text",
  containerClasses,
  value,
  onChange,
  ...props
}: InputProps) {
  const wrapperClasses = containerClasses ? containerClasses : "";

  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-base font-semibold"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className="mt-1 py-3 px-4 rounded-lg w-full border focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

interface SelectProps {
  id: string;
  label?: string;
  options: { value: string | number; label: string }[];
  value?: string | number;
  onChange?: (e) => void;
  containerClasses?: string;
  required?: boolean;
  defaultValue?: string | number;
  ref?: any;
}

function Select({
  id,
  label,
  options,
  value,
  onChange,
  containerClasses,
  ...props
}: SelectProps) {
  const wrapperClasses = containerClasses ? containerClasses : "";
  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-base font-semibold"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className="mt-1 py-3 px-4 rounded-lg w-full border"
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-black dark:bg-gray-950 dark:text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface TextAreaProps {
  id: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e) => void;
  containerClasses?: string;
  ref: any;
}

function TextArea({
  id,
  label,
  placeholder,
  value,
  onChange,
  containerClasses,
  ...props
}: TextAreaProps) {
  const wrapperClasses = containerClasses ? containerClasses : "";
  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-base font-semibold"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className="mt-1 py-3 px-4 rounded-lg w-full border h-24 focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

function Submit({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const wrapperClasses = className ? className : "";
  return (
    <div className={wrapperClasses}>
      <button
        type="submit"
        className="font-bold py-2 px-4 rounded-lg w-full border border-white"
      >
        {text}
      </button>
    </div>
  );
}

Form.Input = Input;
Form.Body = Body;
Form.Select = Select;
Form.TextArea = TextArea;
Form.Submit = Submit;

export default Form;
