import React from 'react';

const Dropdown = ({ id, label, options, value, onChange }) => {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id}>{label}</label>
      <select
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        className='px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
