import React from 'react';
const Table = ({ headings, data, filters, onEdit }) => {
  const includesIgnoreCase = (str, query) => {
    return str?.toLowerCase().includes(query?.toLowerCase());
  };

  return (
    <div className="w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr className='text-center'>
            {headings.map((heading, index) => (
              <th
                key={index}
                className="border-b border-border bg-primary-lightest bg-opacity-60 px-3 py-2 text-left text-sm font-semibold text-primary-dark"
              >
                {heading}
              </th>
            ))}
            <th className="border-b border-border bg-primary-lightest bg-opacity-60 px-3 py-2 text-left text-sm font-semibold text-primary-dark">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((row) =>
              filters.every((filter) => includesIgnoreCase(row[filter.key], filter.value))
            )
            .map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-primary-lightest">
                {headings.map((heading, headingIndex) => (
                  <td key={headingIndex} className="border-b border-border px-3 py-2 text-sm">
                    {row[heading]}
                  </td>
                ))}
                <td className="border-b border-border px-3 py-2 text-sm">
                  <button
                    onClick={() => onEdit(rowIndex)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;