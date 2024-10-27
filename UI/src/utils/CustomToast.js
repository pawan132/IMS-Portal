import React from "react";
import { toast } from "react-hot-toast";

const CustomToast = ({ message }) => (
  <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <p className="mt-1 text-sm text-primary">{message}</p>
      </div>
    </div>
    <div className="flex border-l border-gray-200">
      <button
        onClick={() => toast.dismiss()}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Close
      </button>
    </div>
  </div>
);

export const showCustomToast = (message) => {
  toast.custom((t) => <CustomToast message={message} t={t} />);
};