import React from 'react';

const SearchBox = ({ id, label, placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-2">{label}</label>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>
  );
};

export default SearchBox;
