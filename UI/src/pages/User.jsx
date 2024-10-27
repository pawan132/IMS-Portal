import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ButtonSpinner from '../components/common/ButtonSpinner';
import axiosPrivateInstance from '../utils/axiosConfig';
import AddBanner from '../components/common/AddBanner';

const tableHeading = [
    "name",
    "email",
    "mobile",
    "branch",
    "role",
];

const User = () => {
    const [tableData, setTableData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const [modalData, setModalData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivateInstance.get(`/user/institute`);
            // console.log('response: ', response.data.data);
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

    const fetchRoleData = async () => {
        try {
            const response = await axiosPrivateInstance.get(`/master/roles`);
            // console.log(response.data.data);
            const roles = response.data.data;
            const activeRoles = roles.filter(branch => branch.isActive === true);
            // console.log(activeBranch);
            setRoleData(activeRoles);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    useEffect(() => {
        fetchTableData();
        fetchBranchData();
        fetchRoleData();
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
            await axiosPrivateInstance.put(`/user/${index.id}/toggle`);
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
    if (!modalData.fullName || !modalData.fullName.trim()) {
      errors.name = "Name is required";
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
        if (!modalData.branchId || !modalData.branchId.trim()) {
            errors.branchId = 'Branch is required';
        }
        if (!modalData.roleId || !modalData.roleId.trim()) {
            errors.roleId = 'Role is required';
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

        // console.log(modalData);

        try {
            if (add) {
                await axiosPrivateInstance.post('/user', modalData);
                toast.success('User added successfully');
            } else if (edit) {
                await axiosPrivateInstance.put(`/user/${modalData.id}`, modalData);
                toast.success('User updated successfully');
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
        } else if (e.target.name === 'role') {
            const selectedRole = roleData.find(role => role.name === e.target.value);
            tempData.roleId = selectedRole.id;
            tempData.role = selectedRole.name;
        } else {
            tempData[e.target.name] = e.target.value;
        }
        setModalData(tempData);
    };

    return (
        <div className='w-full h-full'>
            <AddBanner title={'User'} clickHandler={handleAdd} />

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
                                            {field === 'branch' ? item.Branch.name : field === 'role' ? item.RoleMaster.name : field === 'name' ? item.fullName : (item[field] && item[field].length > 30 ? item[field].slice(0, 27) + '...' : item[field] || '')}
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
                        <div className='text-center text-3xl font-bold mb-8'>{add ? 'Add' : 'Edit'} User</div>

                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col'>
                                <div className='flex justify-between flex-wrap'>
                                    <div className='flex flex-col gap-2 w-full'>
                                        <label htmlFor='name'>Name*</label>
                                        <input
                                            type="text"
                                            name='name'
                                            //disabled={edit}
                                            maxLength={50}
                                            placeholder={`Enter user name...`}

                                            onChange={handleAddFormChange}
                                            value={modalData["name"] ||modalData["fullName"]|| ""}
                                            className="form-control w-full"
                                        />
                                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                                    </div>
                                </div>
                                <div className='flex justify-between flex-wrap mt-5'>
                                <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='branchId'>Branch*</label>
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
                                        <label htmlFor='roleId'>Role*</label>
                                        <select
                                            name='roleId'
                                            onChange={handleAddFormChange}
                                            value={modalData.roleId || ""}
                                            className="form-control w-full"
                                        >
                                            <option value="" disabled>Select Role</option>
                                            {roleData.map((role, index) => (
                                                <option key={index} value={role?.id}>{role?.name}</option>
                                            ))}
                                        </select>
                                        {errors.roleId && <span className="text-sm text-red-500">{errors.roleId}</span>}
                                    </div>
                                </div>
                    

                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='email'>Email*</label>
                                        <input
                                            type="email"
                                            name='email'
                                            //disabled={edit}
                                            placeholder={'Enter email...'}
                                            onChange={handleAddFormChange}
                                            value={modalData.email || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                                    </div>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='mobile'>Mobile*</label>
                                        <input
                                            type="number"
                                            name='mobile'
                                            //disabled={edit}
                                            maxLength={10}
                                            placeholder={'Enter mobile no...'}
                                            onChange={handleAddFormChange}
                                            value={modalData.mobile || ""}
                                            className="form-control w-full"
                                        />
                                        {errors.mobile && <span className="text-sm text-red-500">{errors.mobile}</span>}
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

export default User;
