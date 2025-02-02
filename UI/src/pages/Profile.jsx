import toast from 'react-hot-toast';
import Breadcrumb from '../components/shared/Breadcrumb';
import axiosPrivateInstance from '../utils/axiosConfig';
import { useState, useEffect } from 'react';

const Profile = () => {
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchUserData = async () => {
    try {
      const response = await axiosPrivateInstance.get('/user');
      setModalData(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!modalData.fullName || !modalData.fullName.trim()) {
      errors.fullName = 'Name is required';
    }

    if (!modalData.mobile?.trim()) {
      errors.mobile = 'Mobile no is required';
    } else if (modalData.mobile.length !== 10) {
      errors.mobile = 'Mobile no should be 10 digits';
    }

    if (!modalData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(modalData.email)) {
      errors.email = 'Email is invalid';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      await axiosPrivateInstance.put('/user', modalData);
      toast.success('Profile updated successfully');
      fetchUserData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <div className="mx-auto w-full">
        <Breadcrumb pageName="Profile" />
        <div className="grid grid-cols-1 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default">
              <div className="border-b border-stroke py-4 px-7">
                <h3 className="font-medium text-black dark:text-white">Personal Information</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className='w-full'>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor='fullName' className='text-sm font-medium'>Name</label>
                      <input
                        type="text"
                        name='fullName'
                        maxLength={20}
                        placeholder='Enter name...'
                        onChange={handleAddFormChange}
                        value={modalData.fullName || ""}
                        className="form-control w-full rounded py-3"
                      />
                      {errors.fullName && <span className="text-sm text-red-500">{errors.fullName}</span>}
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-5 mt-5'>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor='email' className='text-sm font-medium'>Email</label>
                      <input
                        type="email"
                        name='email'
                        placeholder='Enter email...'
                        onChange={handleAddFormChange}
                        value={modalData.email || ""}
                        className="form-control w-full rounded py-3"
                      />
                      {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                    </div>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor='mobile' className='text-sm font-medium'>Mobile</label>
                      <input
                        type="tel"
                        name='mobile'
                        maxLength={10}
                        placeholder='Enter mobile no...'
                        onChange={handleAddFormChange}
                        value={modalData.mobile || ""}
                        className="form-control w-full rounded py-3"
                      />
                      {errors.mobile && <span className="text-sm text-red-500">{errors.mobile}</span>}
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1"
                      type="button"
                      onClick={fetchUserData}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                      type="submit"
                    >
                      {loading ? <span>Loading...</span> : <span>Save</span>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* Uncomment and update the section below if the photo upload feature is required */}
          {/* <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default">
              <div className="border-b border-stroke py-4 px-7">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <img src={userThree} alt="User" />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2">
                        <button className="text-sm hover:text-primary">
                          Delete
                        </button>
                        <button className="text-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>
                  <div
                    id="FileUpload"
                    className="relative mb-5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Profile;
