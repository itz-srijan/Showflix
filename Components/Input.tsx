import React from "react";

interface InputProps {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type?: string;
  placeholder: string;
  className?: string; // <- Add this line
}

const Input: React.FC<InputProps> = ({
  id,
  onChange,
  value,
  placeholder,
  type = "text", // Default to text if not passed
  className = "", // <- And this
}) => {
  return (
    <div className='relative w-full'>
      <input
        onChange={onChange}
        value={value}
        id={id}
        type={type}
        placeholder={placeholder}
        className={`p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 peer w-full ${className}`}
      />
    </div>
  );
};

export default Input;
