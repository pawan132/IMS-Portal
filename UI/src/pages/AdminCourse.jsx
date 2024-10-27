import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ButtonSpinner from '../components/common/ButtonSpinner';
import axiosPrivateInstance from '../utils/axiosConfig';
import Select from "react-select";
import AddBanner from '../components/common/AddBanner';

const tableHeading = [
    "name",
    "description",
    "branch",
    "module",
];

const AdminCourse = () => {
    const [tableData, setTableData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [moduleData, setModuleData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isBranchSelectDisabled, setIsBranchSelectDisabled] = useState(true);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const [modalData, setModalData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivateInstance.get(`/course/institute`);
            // console.log('courses: ', response.data.data);
            setTableData(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranchData = async () => {
        try {
            const response = await axiosPrivateInstance.get(`/branch/institute`);
            // console.log(response.data.data);
            const branches = response.data.data;
            const activeBranch = branches.filter(branch => branch.isActive === true);
            // console.log(activeBranch);
            setBranchData(activeBranch);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const fetchModuleDataByBranch = async (branchId) => {
        try {
            const response = await axiosPrivateInstance.get(`/module/branch/${branchId}`);
            const modules = response.data.data;
            const activeModules = modules.filter(module => module.isActive === true);
            const moduleOptions = activeModules.map(module => ({
                value: module.id,
                label: module.name
            }));

            // console.log(moduleOptions);
            setModuleData(moduleOptions);
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
        setModalData({
            ...selectedTableData,
            moduleId: selectedTableData.Modules.map(module => module.id)
        });
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
            await axiosPrivateInstance.put(`/course/${index.id}/toggle`, { isActive: index.isActive });
            toast.success(`${index.name} has been ${index.isActive ? 'activated' : 'deactivated'}`);
            index.isActive = !index.isActive;
            setTableData(tempData);
            fetchTableData();
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEdit(false);
        setAdd(true);
        setShowModal(true);
        setModalData({});
    };

    const handleOnClose = (e) => {
        if (e.target.id === 'outside') {
            setShowModal(false);
            setAdd(false);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!modalData.name || !modalData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!modalData.branchId) {
            errors.branchId = 'Branch is required';
        }
        if (!modalData.moduleId || modalData.moduleId.length === 0) {
            errors.moduleId = 'Module is required';
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

        try {
            if (add) {
                await axiosPrivateInstance.post('/course', modalData);
                toast.success('Course added successfully');
            } else if (edit) {
                await axiosPrivateInstance.put(`/course/${modalData.id}`, modalData);
                toast.success('Course updated successfully');
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
        if (e.target.name === 'branchId') {
            tempData.branchId = e.target.value;
            fetchModuleDataByBranch(e.target.value);
            setIsBranchSelectDisabled(false);
        } else if (e.target.name === 'moduleId') {
            const selectedModules = Array.from(e.target.selectedOptions, option => option.value);
            tempData.moduleId = selectedModules;
        } else {
            tempData[e.target.name] = e.target.value;
        }
        setModalData(tempData);
    };

    return (
        <div className='w-full h-full'>
            <AddBanner title={'Course'} clickHandler={handleAdd} />

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
                                            {field === 'branch' ? item.Branch.name : (field === 'module' ? item.Modules.map(module => module.name).join(", ") : (item[field] && item[field].length > 30 ? item[field].slice(0, 27) + '...' : item[field] || ''))}
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
                        <div className='text-center text-3xl font-bold mb-8'>{add ? 'Add' : 'Edit'} Course</div>

                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col'>
                                <div className='flex justify-between flex-wrap'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='name'>Name*</label>
                                        <input
                                            type="text"
                                            name='name'
                                            maxLength={50}
                                            placeholder={`Enter course name...`}
                                            onChange={handleAddFormChange}
                                            value={modalData["name"] || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                                    </div>

                                    <div className='flex flex-col gap-2 w-[49%]'>
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

                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='branchId'>Branch</label>
                                        <select
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

                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='moduleIds'>Module*</label>
                                        <Select
                                            isMulti
                                            name="moduleId"
                                            className='form-control w-full'
                                            value={modalData.moduleId ? modalData.moduleId.map(id => ({
                                                value: id,
                                                label: moduleData.find(module => module.value === id)?.label
                                            })) : []}
                                            onChange={(selectedOptions) => {
                                                const selectedValues = selectedOptions.map(option => option.value);
                                                setModalData(prevData => ({
                                                    ...prevData,
                                                    moduleId: selectedValues
                                                }));
                                            }}
                                            options={moduleData}
                                            isDisabled={isBranchSelectDisabled}
                                        />
                                        {errors.moduleId && <span className="text-sm text-red-500">{errors.moduleId}</span>}
                                    </div>
                                </div>

                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='baseFees'>Tution Fees</label>
                                        <input
                                            type="number"
                                            name='baseFees'
                                            placeholder={`Enter base fees...`}
                                            onChange={handleAddFormChange}
                                            value={modalData["baseFees"] || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.baseFees && <span className="text-sm text-red-500">{errors.baseFees}</span>}
                                    </div>

                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='tax'>GST (%)</label>
                                        <input
                                            type="number"
                                            name='tax'
                                            placeholder={`Enter tax (%)...`}
                                            onChange={handleAddFormChange}
                                            value={modalData["tax"] || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.tax && <span className="text-sm text-red-500">{errors.tax}</span>}
                                    </div>
                                </div>
                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='baseFees'>Books Fees</label>
                                        <input
                                            type="number"
                                            name='booksFees'
                                            placeholder={`Enter books fees...`}
                                            onChange={handleAddFormChange}
                                            value={modalData["booksFees"] || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.booksFees && <span className="text-sm text-red-500">{errors.booksFees}</span>}
                                    </div>

                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='bookstax'>Books GST (%)</label>
                                        <input
                                            type="number"
                                            name='bookstax'
                                            placeholder={`Enter books tax (%)...`}
                                            onChange={handleAddFormChange}
                                            value={modalData["bookstax"] || modalData["booksGST"]|| ""}
                                            className="form-control w-full"
                                        />
                                        {errors.bookstax && <span className="text-sm text-red-500">{errors.bookstax}</span>}
                                    </div>
                                </div>

                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='description'>Total Fees</label>
                                        <input
                                            type="number"
                                            disabled
                                            name='totalFees'
                                            placeholder={`Total fees...`}
                                            onChange={handleAddFormChange}
                                            value={modalData["totalFees"] || ""}
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

export default AdminCourse;