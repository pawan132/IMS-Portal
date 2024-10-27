import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ButtonSpinner from '../components/common/ButtonSpinner';
import axiosPrivateInstance from '../utils/axiosConfig';
import Select from "react-select";
import AddBanner from '../components/common/AddBanner';
import AddAvailability from '../components/AddAvailability/AddAvailability';
import AvailabilityModal from "../components/faculty/FacultyAvailability.jsx";
const roleId = localStorage.getItem('roleId');
const branchId = localStorage.getItem('branchId');
const fetchFrom = roleId !== '2' ? 'branch' : 'institute';

const tableHeading = [
    "fullName",
    "email",
    "mobile",
    "branch",
    "Department"
];

const Faculty = () => {
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const [modalData, setModalData] = useState({ Address: { country: "India" } });
    const [branchData, setBranchData] = useState([]);
    const [moduleData, setModuleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBranch, setSearchBranch] = useState('');

    const [searchModule, setSearchModule]= useState('');

    const [isModuleSelectDisabled, setIsModuleSelectDisabled] = useState(true);
    const [stateData, setStateData] = useState([]);
    const [errors, setErrors] = useState({});
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [departmentData,setDepartmentData] = useState([]);

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivateInstance.get(`/faculty/${fetchFrom}?name=${searchQuery}&branch=${searchBranch}`);
            setTableData(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const FetchTableData = async () => {
        setLoading(true);
        try {
            // Make sure both searchBranch (branchId) and searchModule (moduleId) are set
            const response = await axiosPrivateInstance.get(`/faculty/module/${searchModule}`);
            setTableData(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

   console.log(searchBranch);
    const fetchBranchData = async () => {
        try {
            const response = await axiosPrivateInstance.get(`/branch/institute`);
            const branches = response.data.data;
            const activeBranch = roleId !== '2'
                ? branches.filter(branch => branch.id === Number(branchId))
                : branches.filter(branch => branch.isActive === true);
            setBranchData(activeBranch);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const fetchModuleData = async (branchId) => {
        try {
            const response = await axiosPrivateInstance.get(`/module/branch/${branchId}`);
            const modules = response.data.data;
            const activeModules = modules.filter(module => module.isActive === true);
            const moduleOptions = activeModules.map(module => ({
                value: module.id,
                label: module.name
            }));
            setModuleData(moduleOptions);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const fetchModulesByInstitute = async() => {
        try {
          const response = await axiosPrivateInstance.get('/module/institute');
          
          const modules = response.data.data;
            const activeModules = modules.filter(module => module.isActive === true);
            const moduleOptions = activeModules.map(module => ({
                value: module.id,
                label: module.name
            }));
            console.log(moduleOptions);
            setDepartmentData(moduleOptions);
          } 
        catch (error) {
            toast.error(error.response?.data?.message);
        }
      }

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
        
        fetchBranchData();
        fetchModulesByInstitute();
        
        fetchStates();
    }, []);

    useEffect(() => {
        if (searchBranch) {
            fetchTableData(); // Call this when searchBranch is updated
        }
    }, [searchBranch]); 

    useEffect(() => {
        
        if (searchModule) {
            FetchTableData();
        }
    }, [ searchModule]);

    // useEffect(() => {
    //     fetchTableData();
    //     // fetchBranchData();
    //     // fetchStates();
    // }, [searchQuery,searchBranch]);

    const fetchPreFillData = (index) => {
        const selectedTableData = tableData.find(item => item.id === index.id);
        // console.log('selectedTableData: ', selectedTableData);
        setModalData({
            ...selectedTableData,
            Address: {
                ...selectedTableData.Address, // Spread existing Address data
                country: selectedTableData.Address?.country || "India" // Default to "India" if country is undefined or null
              },
            moduleId: selectedTableData.Modules.map(module => module.id)
        });
        fetchModuleData(selectedTableData.branchId);
        setIsModuleSelectDisabled(false);
    };

    const handleEditButton = (e) => {
        setAdd(false);
        setEdit(true);
        const index = tableData[parseInt(e.target.name)];
        fetchPreFillData(index);
        setShowModal(true);
    };

    const handleAvailability = (e) => {
        const index = e.currentTarget.name;
        // console.log(showAvailabilityModal);
        setShowAvailabilityModal(true);
        // console.log(showAvailabilityModal);

    };

    const handleAvailabilityClose = () => {
        setShowAvailabilityModal(false);
    };

    const handleActivate = async (e) => {
        const tempData = [...tableData];
        const index = tempData[parseInt(e.target.name)];
        try {
            setLoading(true);
            await axiosPrivateInstance.put(`/faculty/${index.id}/toggle`, { isActive: index.isActive });
            toast.success(`${index.User.fullName} has been ${index.isActive ? 'activated' : 'deactivated'}`);
            index.isActive = !index.isActive;
            setTableData(tempData);
            fetchTableData();
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAvailability = () => {
        
        setShowModal(true);
    };

    const handleAdd = () => {
        setEdit(false);
        setAdd(true);
        setShowModal(true);
        roleId !== '2' ? setModalData({ branchId: branchId, Address: { country: "" } }) : setModalData({ Address: { country: "" } });
        if (roleId !== '2') {
            fetchModuleData(branchId);
            setIsModuleSelectDisabled(false);
        }
        else {
            setIsModuleSelectDisabled(true);
        }
    };

    const handleOnClose = (e) => {
        if (e.target.id === 'outside') {
            setShowModal(false);
            setAdd(false);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!modalData.User?.fullName?.trim()) {
            errors.name = 'Name is required';
        }

        if (!modalData.User?.mobile?.trim()) {
            errors.mobile = 'Mobile no is required';
        } else if (modalData.User.mobile.length !== 10) {
            errors.mobile = 'Mobile no should be 10 digits';
        }

        if (!modalData.User?.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(modalData.User.email)) {
            errors.email = 'Email is invalid';
        }

        if (!modalData.Address?.address || !modalData.Address.address.trim()) {
            errors.address = 'Address is required';
        } else if (modalData.Address.address.length > 100) {
            errors.address = 'Address should not exceed 100 characters';
        }

        if (!modalData.Address?.city.trim()) {
            errors.city = 'City is required';
        } else if (modalData.Address.city.length > 20) {
            errors.city = 'City should not exceed 20 characters';
        }

        if (!modalData.Address?.state.trim()) {
            errors.state = 'State is required';
        }

        if (!modalData.Address?.postalCode || typeof modalData.Address.postalCode !== 'string' || !modalData.Address.postalCode.trim())  {
            errors.postalCode = 'Postal code is required';
        } else if (modalData.Address.postalCode.length !== 6) {
            errors.postalCode = 'Postal code should be 6 digits';
        }

        if (!modalData.branchId) {
            errors.branchId = 'Branch is required';
        }

        if (!modalData.moduleId || modalData.moduleId.length === 0) {
            errors.moduleId = 'Modules are required';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // console.log('modalData: ', modalData);

        setLoading(true);
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            if (add) {
                await axiosPrivateInstance.post(`/faculty`, modalData);
                toast.success('Faculty added successfully');
                setAdd(false);
            } else if (edit) {
                await axiosPrivateInstance.put(`/faculty/${modalData.id}`, modalData);
                toast.success('Faculty updated successfully');
                setEdit(false);
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
        // console.log(modalData);
        // console.log(e.target.name.includes('User'));
        const tempData = { ...modalData };
        if (e.target.name.includes('Address')) {
            tempData['Address'] = tempData['Address'] || {};
            tempData['Address'][e.target.name.split('.')[1]] = e.target.value;
        } else if (e.target.name.includes('User')) {
            tempData['User'] = tempData['User'] || {};
            tempData['User'][e.target.name.split('.')[1]] = e.target.value;
        } else if (e.target.name === 'moduleId') {
            const selectedModules = Array.from(e.target.selectedOptions, option => option.value);
            tempData.moduleId = selectedModules;
        } else if (e.target.name === 'branchId') {
            tempData[e.target.name] = e.target.value;
            // console.log('branchId: ', e.target.value);
            fetchModuleData(e.target.value);
            setIsModuleSelectDisabled(false);
        } else {
            tempData[e.target.name] = e.target.value;
        }
        setModalData(tempData);
    };

    // const filteredTableData = tableData.filter(item =>
    //     item.User?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    //     (searchBranch === '' || item.Branch.id === parseInt(searchBranch))
    // );

    return (
        <div className='w-full h-full'>
            <AddBanner title={'Faculty'} clickHandler={handleAdd} />

            <div className='grid grid-cols-3 gap-5 mt-5'>
                <input
                    name='searchByName'
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select
                    name='searchByBranch'
                    onChange={(e) => setSearchBranch(e.target.value)}
                    value={searchBranch}
                    className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="" disabled>Select branch</option>
                    {branchData.map((branch, index) => (
                        <option key={index} value={branch.id}>{branch.name}</option>
                    ))}
                </select>

                {/* <select
                    name='searchByModule'
                    onChange={(e) => setSearchModule(e.target.value)}
                    value={searchModule}
                    className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="" disabled>Select Module</option>
                    {moduleData.map((module, index) => (
                        <option key={index} value={module.id}>{module.name}</option>
                    ))}
                </select> */}
                <select
                    name='searchByModule'
                    onChange={(e) => setSearchModule(e.target.value)}
                    value={searchModule}
                    className="px-4 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="" disabled>Select Department</option>
                    {departmentData.length > 0 ? (
                        departmentData.map((module, index) => (
                            <option key={index} value={module.value}>{module.label}</option>
                        ))
                    ) : (
                        <option disabled>No Department Available</option>
                    )}
                </select>
            </div>

            <div className="relative mt-8 overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                        <tr className='text-center'>
                            {tableHeading.map((item, index) => (
                                <th scope="col" className="px-6 py-3" key={index}>{item.split('_').join(" ")}</th>
                            ))}
                            <th scope="col" className="px-6 py-3">Availablity</th>
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
                                            {field === 'branch' ? item.Branch.name : (field === 'Department' ? item.Modules?.map(module => module.name).join(", ") : item.User[field] && item.User[field].length > 30 ? item.User[field].slice(0, 27) + '...'
                                                : item.User[field] || '')}
                                        </div>
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-center">
                                    <button onClick={handleAvailability} name={index} className='py-1 px-2 rounded-md bg-primary text-white/80 cursor-pointer'>Availability</button>
                                </td>
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


            {showAvailabilityModal && (
                <AvailabilityModal
                    show={showAvailabilityModal}
                    close={handleAvailabilityClose}
                />
            )}


            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[9999] flex justify-center items-center overflow-auto' id='outside' onClick={handleOnClose}>
                    <div className='shadow-lg h-[90vh] w-6/12 mx-auto bg-white rounded-xl p-8 overflow-y-scroll z-[40000]'>
                        <div className='text-center text-3xl font-bold mb-8'>{add ? 'Add' : 'Edit'} Faculty</div>

                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col'>
                                <div className='flex justify-between flex-wrap'>
                                    <div className='flex flex-col gap-2 w-full'>
                                        <label htmlFor='name'>Name*</label>
                                        <input
                                            type="text"
                                            name='User.fullName'
                                            maxLength={50}
                                            placeholder={'Enter faculty name...'}
                                            onChange={handleAddFormChange}
                                            value={(modalData["User"] ? modalData["User"]["fullName"] : "") || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                                    </div>
                                </div>

                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='email'>Email*</label>
                                        <input
                                            type="email"
                                            name='User.email'
                                            placeholder={'Enter email...'}
                                            onChange={handleAddFormChange}
                                            value={(modalData["User"] ? modalData["User"]["email"] : "") || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                                    </div>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='mobile'>Mobile*</label>
                                        <input
                                            type="number"
                                            name='User.mobile'
                                            maxLength={10}
                                            placeholder={'Enter mobile no...'}
                                            onChange={handleAddFormChange}
                                            value={(modalData["User"] ? modalData["User"]["mobile"] : "") || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.mobile && <span className="text-sm text-red-500">{errors.mobile}</span>}
                                    </div>

                                </div>

                                <div className='flex justify-between flex-wrap mt-5'>
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
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='moduleId'>Department*</label>
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
                                            isDisabled={isModuleSelectDisabled}
                                        />
                                        {errors.moduleId && <span className="text-sm text-red-500">{errors.moduleId}</span>}
                                    </div>
                                </div>

                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-full'>
                                        <label htmlFor='address'>Address*</label>
                                        <input
                                            type="text"
                                            name='Address.address'
                                            maxLength={100}
                                            placeholder={'Enter address...'}
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
                                            placeholder={'Enter city...'}
                                            onChange={handleAddFormChange}
                                            value={(modalData["Address"] ? modalData["Address"]["city"] : "") || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.city && <span className="text-sm text-red-500">{errors.city}</span>}
                                    </div>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='state'>State*</label>
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
                                            value={(modalData["Address"] ? modalData["Address"]["country"] : "") ||"" }
                                            className="form-control w-full"
                                        />
                                    </div>

                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='postalCode'>Postal Code*</label>
                                        <input
                                            type="number"
                                            name='Address.postalCode'
                                            maxLength={6}
                                            placeholder={'Enter postal code...'}
                                            onChange={handleAddFormChange}
                                            value={modalData["Address"]["postalCode"]  || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.postalCode && <span className="text-sm text-red-500">{errors.postalCode}</span>}
                                    </div>
                                </div>

                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='startDate'>Start Date*</label>
                                        <input
                                            type="date"
                                            name='startDate'
                                            placeholder={`Select start date...`}
                                            onChange={handleAddFormChange}
                                            value={modalData.startDate || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.startDate && <span className="text-sm text-red-500">{errors.startDate}</span>}
                                    </div>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='endDate'>End Date*</label>
                                        <input
                                            type="date"
                                            name='endDate'
                                            placeholder={`Select end date...`}
                                            onChange={handleAddFormChange}
                                            value={modalData.endDate || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.endDate && <span className="text-sm text-red-500">{errors.endDate}</span>}
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

export default Faculty;