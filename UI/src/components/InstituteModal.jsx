import React, { useEffect, useState } from 'react';
import { institutesEndpoints } from '../services/apis';
import axiosPrivateInstance from '../utils/axiosConfig';
import { useDispatch } from 'react-redux';
import { setToken } from "../redux/slices/authSlice";

const InstituteModal = ({ isOpen, onClose, isEdit, institute, setIsEdit, setRefresh }) => {
  const initialForm = {
    name: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    mobile: "",
    email: "",
    website: "",
    establishedYear: null,
  };

  // console.log(isEdit);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEdit && institute) {
      setFormData({
        name: institute.name,
        address: institute.Address?.address,
        country: institute.Address?.country,
        state: institute.Address?.state,
        city: institute.Address?.city,
        postalCode: institute.Address?.postalCode,
        mobile: institute.mobile,
        email: institute.email,
        website: institute.website,
        establishedYear: institute.establishedYear
      })
    }
  }, [isEdit, institute]);

  const [formData, setFormData] = useState(initialForm);
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchStates = async () => {
    try {
      const state = await axiosPrivateInstance.get('/master/states');
      // console.log(state.data.data);
      setStateData(state.data.data)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchStates();
    }
  }, [isOpen])


  const handleChange = (e) => {
    // console.log(formData);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(initialForm);
  }

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.mobile) {
      errors.mobile = 'Mobile no is required';
    } else if (formData.mobile.length !== 10) {
      errors.mobile = 'Mobile no should be 10 digits';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.establishedYear) {
      errors.establishedYear = 'Established year is required';
    } else if (!/^\d{4}$/.test(formData.establishedYear)) {
      errors.establishedYear = 'Established year should be 4 digits';
    }
    if (!formData.address && !formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address && formData.address.length > 100) {
      errors.address = 'Address should not exceed 100 characters';
    }
    if (!formData.city && !formData.city.trim()) {
      errors.city = 'City is required';
    } else if (formData.city && formData.city.length > 20) {
      errors.city = 'City should not exceed 20 characters';
    }
    if (!formData.state && !formData.state.trim()) {
      errors.state = 'State is required';
    }
    if (!formData.postalCode) {
      errors.postalCode = 'Postal code is required';
    } else if (formData.postalCode && formData.postalCode.length !== 6) {
      errors.postalCode = 'Postal code should be 6 digits';
    }
    if (formData.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) {
      errors.website = 'Website URL is invalid';
    }

    setErrors(errors);
    console.error(errors);
    console.error(Object.keys(errors).length === 0);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    // console.log(formData);
    if (isEdit) {
      try {
        // console.log('editing');
        const response = await axiosPrivateInstance.put(institutesEndpoints.UPDATE_INSTITUTE, formData);
        // console.log(response);
        setIsEdit(false);
        setRefresh(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        // console.log('created new');
        // console.log(institutesEndpoints.CREATE_INSTITUTE);
        const response = await axiosPrivateInstance.post(institutesEndpoints.CREATE_INSTITUTE, formData);
        // console.log(response.data.data);
        localStorage.setItem("branchId", JSON.stringify(response.data.branch.id));
        localStorage.setItem("instituteId", JSON.stringify(response.data.data.id));
        dispatch(setToken(response.data.token));
        localStorage.setItem("token", JSON.stringify(response.data.token));
        resetForm()
        setRefresh(true);
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
    onClose()
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed inset-0 z-[9999] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="shadow-lg h-4/5 w-6/12 mx-auto bg-white rounded-xl p-8 overflow-y-scroll z-[40000]">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Institute Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Institute Name*</label>
              <input
                type="text"
                name="name"
                maxLength={50}
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              />
              {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address*</label>
              <input
                type="text"
                name="address"
                maxLength={100}
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              />
              {errors.address && <span className="text-sm text-red-500">{errors.address}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City*</label>
                <input
                  type="text"
                  name="city"
                  maxLength={20}
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
                {errors.city && <span className="text-sm text-red-500">{errors.city}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State*</label>
                <select
                  name='state'
                  onChange={handleChange}
                  value={formData.state}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                >
                  <option value="" disabled>Select state</option>
                  {stateData.map((state, index) => (
                    <option key={index} value={state.name}>{state.name}</option>
                  ))}
                </select>
                {errors.state && <span className="text-sm text-red-500">{errors.state}</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Country*</label>
                <input
                  type="text"
                  name="country"
                  maxLength={20}
                  //disabled
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Postal Code*</label>
                <input
                  type="number"
                  name="postalCode"
                  maxLength={6}
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
                {errors.postalCode && <span className="text-sm text-red-500">{errors.postalCode}</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile*</label>
                <input
                  type="number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
                {errors.mobile && <span className="text-sm text-red-500">{errors.mobile}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
                {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Website Link</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
                {errors.website && <span className="text-sm text-red-500">{errors.website}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Established Year*</label>
                <input
                  type="number"
                  name="establishedYear"
                  maxLength={4}
                  value={formData.establishedYear}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
                {errors.establishedYear && <span className="text-sm text-red-500">{errors.establishedYear}</span>}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => { setIsEdit(false); onClose(); }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded"
              >
                {loading ? <span>Loading...</span> : <span>Submit</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default InstituteModal;
