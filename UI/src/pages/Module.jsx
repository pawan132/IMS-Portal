import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ButtonSpinner from '../components/common/ButtonSpinner';
import axiosPrivateInstance from '../utils/axiosConfig';
import axios from 'axios';
import AddBanner from '../components/common/AddBanner';
const roleId = localStorage.getItem('roleId');
const branchId = localStorage.getItem('branchId');
const fetchFrom = roleId !== '2' ? 'branch' : 'institute';

const tableHeading = [
    "name",
    "description",
    "branch",
];

const Module = () => {
    const [tableData, setTableData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const [modalData, setModalData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // const fetchTableData = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axiosPrivateInstance.get(`/module/${fetchFrom}`);
    //         setTableData(response.data.data);
    //     } catch (error) {
    //         toast.error(error.response?.data?.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchTableData = async () => {
        setLoading(true);
        try {
          const response = await axiosPrivateInstance.get(`/module/${fetchFrom}`);
      
          if (response.data && response.data.data) {
            // Flatten the response data to make both course and branch data accessible
            const flattenedData = response.data.data.map(course => ({
              // Spread all course properties (id, name, description, etc.)
              id: course.id,
              name: course.name,
              description: course.description,
              branchId: course.branchId,
              createdBy: course.createdBy,
              createdAt: course.createdAt,
              modifiedBy: course.modifiedBy,
              modifiedAt: course.modifiedAt,
              isActive: course.isActive,
      
              // Spread Branch details (flattening the nested Branch object)
              branchName: course.Branch.name,
              branchMobile: course.Branch.mobile,
              branchEmail: course.Branch.email,
              branchAddressId: course.Branch.addressId,
              branchInstituteId: course.Branch.instituteId,
            }));
      
            setTableData(flattenedData);  // Set the flattened data into the table
            toast.success("Data fetched successfully");
          } else {
            toast.error("Unexpected data structure");
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("An unexpected error occurred.");
          }
        } finally {
          setLoading(false);
        }
      };
      

    console.log(tableData);

    const fetchBranchData = async () => {
        try {
            const response = await axiosPrivateInstance.get(`/branch/institute`);
            // console.log(response.data.data);
            const branches = response.data.data;
            const activeBranch = roleId !== '2'
                ? branches.filter(branch => branch.id === Number(branchId))
                : branches.filter(branch => branch.isActive === true);
            setBranchData(activeBranch);

        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    useEffect(() => {
        fetchTableData();
        fetchBranchData();
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
        // console.log('tempData: ', tempData);
        // console.log('e.target.name: ', e.target.name);
        const index = tempData[parseInt(e.target.name)];
        // console.log('index: ', index);
        try {
            setLoading(true);
            await axiosPrivateInstance.put(`/module/${index.id}/toggle`);
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
        roleId !== '2' ? setModalData({ branchId: branchId }) : setModalData({});
    };

    const handleOnClose = (e) => {
        if (e.target.id === 'outside') {
            setShowModal(false);
            setAdd(false);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!modalData.name || !String(modalData.name).trim()) {
            errors.name = "Name is required";
          }
          if (!modalData.branchId || !String(modalData.branchId).trim()) {
            errors.branchId = "Branch is required";
          }

        setErrors(errors);
        console.error(errors);
        console.error(Object.keys(errors).length === 0);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        console.log(modalData);

        try {
            if (add) {
                await axiosPrivateInstance.post(`/module/createmodule`, modalData);
                // await axiosPrivateInstance.post('/module', modalData);
                toast.success('Module added successfully');
            } else if (edit) {
                await axiosPrivateInstance.put(`/module/${modalData.id}`, {
                    name: modalData.name,
                    description:modalData.description,
                     branchId:modalData.branchId});
                toast.success('Module updated successfully');
            }
            fetchTableData();
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
            setShowModal(false);
            setAdd(false);
            setEdit(false);
        }
    };

    const handleAddFormChange = (e) => {
        const tempData = { ...modalData };
        if (e.target.name === 'branch') {
            const selectedBranch = branchData.find(branch => branch.name === e.target.value);
            tempData.branchId = selectedBranch.id;
            tempData.branch = selectedBranch.name;
        } else {
            tempData[e.target.name] = e.target.value;
        }
        setModalData(tempData);
    };

    return (
        <div className='w-full h-full'>
            <AddBanner title={'Department'} clickHandler={handleAdd} />

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
                        {/* {!loading && tableData.map((item, index) => (
                            <tr className='bg-white border-b' key={index}>
                                {tableHeading.map((field, i) => (
                                    <td className="px-6 py-4 text-center" key={i}>
                                        <div className='whitespace-nowrap'>
                                            {field === 'Branch' ? item.name : (item[field] && item[field].length > 30 ? item[field].slice(0, 27) + '...' : item[field] || '')}
                                        </div>
                                    </td>
                                ))} */}
                                {!loading && tableData.map((item, index) => (
  <tr className='bg-white border-b' key={index}>
    {tableHeading.map((field, i) => (
      <td className="px-6 py-4 text-center" key={i}>
        <div className='whitespace-nowrap'>
          {field === 'branch' 
            ? item.branchName  // Access nested Branch object
            : (item[field] && typeof item[field] === 'string' && item[field].length > 30 
                ? item[field].slice(0, 27) + '...' 
                : item[field] || ''
              )
          }
        </div>
      </td>
    ))}


                                <td className="px-6 py-4 text-center">
                                    <button onClick={handleEditButton} name={index} className='py-1 px-2 rounded-md bg-primary text-white/80 cursor-pointer'>Edit</button>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={handleActivate} value={item.isActive} name={index} className={`py-1 px-2 rounded-md text-white/80 cursor-pointer ${item.isActive ? "bg-red-900" : "bg-green-600"}`}>{item.isActive ? "Deactivate" : "Activate"}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[9999] flex justify-center items-center' id='outside' onClick={handleOnClose}>
                    <div className='shadow-lg h-7/8 w-6/12 mx-auto bg-white rounded-xl p-8 overflow-y-scroll z-[40000]'>
                        <div className='text-center text-3xl font-bold mb-8'>{add ? 'Add' : 'Edit'} Module</div>

                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col'>
                                <div className='flex justify-between flex-wrap'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='name'>Name*</label>
                                        <input
                                            type="text"
                                            name='name'
                                            maxLength={50}
                                            placeholder={`Enter module name...`}
                                            onChange={handleAddFormChange}
                                            value={modalData["name"] || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                                    </div>

                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='branchId'>Branch*</label>
                                        <select
                                            disabled={roleId !== '2'}
                                            name='branchId'
                                            onChange={handleAddFormChange}
                                            value={modalData.branchId || ""}
                                            className="form-control w-full"
                                        >
                                            <option value="" disabled>Select branch</option>
                                            {branchData.map((branch, index) => (
                                                <option key={index} value={branch?.id}>{branch?.name}</option>
                                            ))}
                                        </select>
                                        {errors.branchId && <span className="text-sm text-red-500">{errors.branchId}</span>}
                                    </div>
                                </div>

                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-full'>
                                        <label htmlFor='description'>Description</label>
                                        <input
                                            type="text"
                                            name='description'
                                            maxLength={100}
                                            placeholder={`Enter description...`}
                                            onChange={handleAddFormChange}
                                            value={modalData["description"] || ""}
                                            className="form-control w-full"
                                        />
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

export default Module;