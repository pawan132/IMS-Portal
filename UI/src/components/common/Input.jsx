import React from 'react';

const Input = ({ id, label, type, name, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id} className="block mt-4 mb-2">{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default Input;
