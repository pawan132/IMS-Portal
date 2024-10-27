import React from 'react';

const Modal = ({ showModal, title, formFields, modalData, handleOnClose, handleFormChange, handleSubmit, additionalContent }) => {
  return (
    <div>
      {showModal && (
        <div
          id="outside"
          onClick={handleOnClose}
          className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[40] flex justify-center items-center"
        >
          <div className="shadow-lg h-4/5 w-11/12 mx-auto bg-white rounded-xl p-8 overflow-y-scroll z-[40000]">
            <h2 className="text-center text-3xl font-bold mb-8">{title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-2">
                {formFields.map((field, index) => (
                  <div key={index} className="mb-4">
                    <label className="block mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={modalData[field.name] || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  </div>
                ))}
              </div>

              {additionalContent && (
                <div className="mb-4">
                  {additionalContent}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  {title.includes('Add') ? 'Add' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
