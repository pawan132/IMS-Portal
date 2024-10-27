import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ButtonSpinner from '../components/common/ButtonSpinner';
import axiosPrivateInstance from '../utils/axiosConfig';
import AddBanner from '../components/common/AddBanner';

const tableHeading = [
  "name",
  "address",
  "state",
  "city",
  "mobile",
  "email",
];

const Branch = () => {
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [modalData, setModalData] = useState({ Address: { country: "India" } });
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivateInstance.get(`/branch/institute`);
      // console.log(response.data.data);
      setTableData(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

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
    fetchTableData();
    fetchStates();
  }, []);

  const fetchPreFillData = (index) => {
    const selectedTableData = tableData.find(item => item.id === index.id);
    setModalData(selectedTableData);
  };

  const handleEditButton = (e) => {
    setAdd(false);
    setEdit(true);
    const index = tableData[parseInt(e.target.name)];
    fetchPreFillData(index);
    setShowModal(true);
  };

  const handleActivate = async (e) => {
    const tempData = [...tableData];
    const index = tempData[parseInt(e.target.name)];
    try {
      setLoading(true);
      await axiosPrivateInstance.put(`/branch/${index.id}/toggle`);
      index.isActive = !index.isActive;
      toast.success(`${index.name} has been ${index.isActive ? 'activated' : 'deactivated'}`);
      setTableData(tempData);
      fetchTableData();
    } catch (error) {
      toast.error(`${index.name} failed to ${index.isActive ? 'activated' : 'deactivated'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEdit(false);
    setAdd(true);
    setShowModal(true);
    setModalData({ Address: { country: "" } });
  };

  const handleOnClose = (e) => {
    if (e.target.id === 'outside') {
      setShowModal(false);
      setAdd(false);
    }
  };

  const validateForm = () => {
    console.log(modalData);
    const errors = {};

    if (!modalData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!modalData?.mobile) {
      errors.mobile = 'Mobile no is required';
    } else if (modalData.mobile.length !== 10) {
      errors.mobile = 'Mobile no should be 10 digits';
    }

    if (!modalData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(modalData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!modalData.Address?.address?.trim()) {
      errors.address = 'Address is required';
    } else if (modalData.Address.address.length > 100) {
      errors.address = 'Address should not exceed 100 characters';
    }

    if (!modalData.Address?.city?.trim()) {
      errors.city = 'City is required';
    } else if (modalData.Address.city.length > 20) {
      errors.city = 'City should not exceed 20 characters';
    }

    if (!modalData.Address?.state) {
      errors.state = 'State is required';
    }

    if (!modalData.Address?.postalCode) {
      errors.postalCode = 'Postal code is required';
    } else if (modalData.Address.postalCode.length !== 6) {
      errors.postalCode = 'Postal code should be 6 digits';
    }

    setErrors(errors);
    console.error(errors);
    console.error(Object.keys(errors).length === 0);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log(modalData);

    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (add) {
        await axiosPrivateInstance.post(`${process.env.REACT_APP_BASE_URL}/branch`, modalData);
        toast.success('Branch added successfully');
        setAdd(false);
      } else if (edit) {
        await axiosPrivateInstance.put(`${process.env.REACT_APP_BASE_URL}/branch/${modalData.id}`, modalData);
        toast.success('Branch updated successfully');
        setEdit(false);
      }
      setShowModal(false);
      fetchTableData();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFormChange = (e) => {
    const tempData = { ...modalData };
    if (e.target.name.includes('Address')) {
      tempData['Address'] = tempData['Address'] || {};
      tempData['Address'][e.target.name.split('.')[1]] = e.target.value;
    } else {
      tempData[e.target.name] = e.target.value;
    }
    setModalData(tempData);
  };

  return (
    <div className='w-full h-full'>
      <AddBanner title={'Branch'} clickHandler={handleAdd} />

      <div className="relative mt-12 overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr className='text-center'>
              {tableHeading.map((item, index) => (
                <th scope="col" className="px-6 py-3" key={index}>{item.split('_').join(" ")}</th>
              ))}
              <th scope="col" className="px-6 py-3">Edit</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && tableData.map((item, index) => (
              <tr className='bg-white border-b' key={index}>
                {tableHeading.map((field, i) => (
                  <td className="px-6 py-4 text-center" key={i}>
                    <div className='whitespace-nowrap'>
                      {field === 'address' ? item.Address?.address
                        : field === 'city' ? item.Address?.city
                          : field === 'state' ? item.Address?.state
                            : field === 'country' ? item.Address?.country
                              : item[field] && item[field].length > 30 ? item[field].slice(0, 27) + '...'
                                : item[field] || ''}
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <button disabled={index === 0} onClick={handleEditButton} name={index} className={`py-1 px-2 rounded-md ${index === 0 ? 'bg-gray-500' : 'bg-primary'} text-white/80 cursor-pointer`}>Edit</button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button disabled={index === 0} onClick={handleActivate} value={item.isActive} name={index} className={`py-1 px-2 rounded-md text-white/80 cursor-pointer ${index === 0 ? 'bg-gray-500' : item.isActive ? "bg-red-900" : "bg-green-600"}`}>{item.isActive ? "Deactivate" : "Activate"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[9999] flex justify-center items-center overflow-auto' id='outside' onClick={handleOnClose}>
          <div className='shadow-lg h-4/5 w-6/12 mx-auto bg-white rounded-xl p-8 overflow-y-scroll z-[40000]'>
            <div className='text-center text-3xl font-bold mb-8'>{add ? 'Add' : 'Edit'} Branch</div>

            <form onSubmit={handleSubmit}>
              <div className='flex flex-col'>
                <div className='flex justify-between flex-wrap'>
                  <div className='flex flex-col gap-2 w-[49%]'>
                    <label htmlFor='name'>Name*</label>
                    <input
                      type="text"
                      name='name'
                      maxLength={50}
                      placeholder={`Enter branch name...`}
                      onChange={handleAddFormChange}
                      value={modalData["name"] || ""}
                      className="form-control w-full"
                    />
                    {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                  </div>

                  <div className='flex flex-col gap-2 w-[49%]'>
                    <label htmlFor='email'>Email*</label>
                    <input
                      type="email"
                      name='email'
                      placeholder={`Enter email...`}
                      onChange={handleAddFormChange}
                      value={modalData["email"] || ""}
                      className="form-control w-full"
                    />
                    {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                  </div>
                </div>

                <div className='flex justify-between flex-wrap mt-5'>
                  <div className='flex flex-col gap-2 w-[49%]'>
                    <label htmlFor='mobile'>Contact 1*</label>
                    <input
                      type="number"
                      name='mobile'
                      maxLength={10}
                      placeholder={`Enter contact no...`}
                      onChange={handleAddFormChange}
                      value={modalData["mobile"] || ""}
                      className="form-control w-full"
                    />
                    {errors.mobile && <span className="text-sm text-red-500">{errors.mobile}</span>}
                  </div>
                  <div className='flex flex-col gap-2 w-[49%]'>
                    <label htmlFor='mobile2'>Contact 2</label>
                    <input
                      type="number"
                      name='mobile2'
                      maxLength={10}
                      placeholder={`Enter contact no...`}
                      onChange={handleAddFormChange}
                      value={modalData["mobile2"] || ""}
                      className="form-control w-full"
                    />
                  </div>
                </div>

                <div className='flex justify-between flex-wrap mt-5'>
                  <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor='address'>Address*</label>
                    <input
                      type="text"
                      name='Address.address'
                      maxLength={100}
                      placeholder={`Enter address...`}
                      onChange={handleAddFormChange}
                      value={(modalData["Address"] ? modalData["Address"]["address"] : "") || ""}
                      className="form-control w-full"
                    />
                    {errors.address && <span className="text-sm text-red-500">{errors.address}</span>}
                  </div>
                </div>

                <div className='flex justify-between flex-wrap mt-5'>
                  <div className='flex flex-col gap-2 w-[49%]'>
                    <label htmlFor='city'>City*</label>
                    <input
                      type="text"
                      name='Address.city'
                      maxLength={20}
                      placeholder={`Enter city...`}
                      onChange={handleAddFormChange}
                      value={(modalData["Address"] ? modalData["Address"]["city"] : "") || ""}
                      className="form-control w-full"
                    />
                    {errors.city && <span className="text-sm text-red-500">{errors.city}</span>}
                  </div>

                  <div className='flex flex-col gap-2 w-[49%]'>
                    <label htmlFor='state'>State</label>
                    <select
                      name='Address.state'
                      onChange={handleAddFormChange}
                      value={(modalData["Address"] ? modalData["Address"]["state"] : "") || ""}
                      className="form-control w-full"
                    >
                      <option value="" disabled>Select state</option>
                      {stateData.map((state, index) => (
                        <option key={index} value={state.name}>{state.name}</option>
                      ))}
                    </select>
                    {errors.state && <span className="text-sm text-red-500">{errors.state}</span>}
                  </div>
                </div>

                <div className='flex justify-between flex-wrap mt-5'>
                  <div className='flex flex-col gap-2 w-[49%]'>
                    <label htmlFor='country'>Country</label>
                    <input
                      type="text"
                      name='Address.country'
                      placeholder={`Enter country...`}
                      onChange={handleAddFormChange}
                      value={(modalData["Address"] ? modalData["Address"]["country"] : "") || ""}
                      className="form-control w-full"
                    />
                  </div>

                  <div className='flex flex-col gap-2 w-[49%]'>
                    <label htmlFor='postalCode'>Postal Code*</label>
                    <input
                      type="number"
                      name='Address.postalCode'
                      maxLength={6}
                      placeholder={`Enter postal code...`}
                      onChange={handleAddFormChange}
                      value={(modalData["Address"] ? modalData["Address"]["postalCode"] : "") || ""}
                      className="form-control w-full"
                    />
                    {errors.postalCode && <span className="text-sm text-red-500">{errors.postalCode}</span>}
                  </div>
                </div>

                <div className='w-full flex justify-center items-center'>
                  <button type="submit" className='mt-8 py-4 px-12 rounded-md text-xl bg-primary text-white w-full'>
                    {loading ? <span>Loading...</span> : <span>Submit</span>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && <ButtonSpinner />}
    </div>
  );
};

export default Branch;