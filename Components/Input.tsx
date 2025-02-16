import React from "react";
interface Inputprops {
  id: string;
  onChange: any;
  value: string;
  type?: string;
  placeholder: string;
}
const Input: React.FC<Inputprops> = ({
  id,
  onChange,
  value,
  placeholder,
  type,
}) => {
  return (
    <div className="relative">
      <input
        onChange={onChange}
        value={value}
        id={id}
        type={type}
        placeholder={placeholder}
        className='p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 peer'
      />
    </div>
  );
};
export default Input;
