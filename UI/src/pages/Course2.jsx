import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ButtonSpinner from '../components/common/ButtonSpinner';
import axiosPrivateInstance from '../utils/axiosConfig';

const branches = ["Main Campus", "North Campus", "South Campus", "East Campus", "West Campus"];

const Course2 = () => {
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const [modalData, setModalData] = useState({});
    const [loading, setLoading] = useState(false);

    const [dummyData, setDummyData] = useState([
        {
            id: 1,
            name: "Python",
            description: "Introduction to Programming",
            branch: "Main Campus",
            isActive: true,
        },
        {
            id: 2,
            name: "JavaScript",
            description: "Web Development Basics",
            branch: "East Campus",
            isActive: true,
        },
        {
            id: 3,
            name: "Java",
            description: "Object-Oriented Programming",
            branch: "West Campus",
            isActive: false,
        },
        {
            id: 4,
            name: "C++",
            description: "Data Structures and Algorithms",
            branch: "Main Campus",
            isActive: true,
        },
        {
            id: 5,
            name: "Ruby",
            description: "Web Application Development",
            branch: "North Campus",
            isActive: false,
        }
    ]);

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivateInstance.get(`/branch/institute`);
            // console.log(response.data.data);
            setTableData(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch branch');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    const fetchPreFillData = (index) => {
        const selectedTableData = dummyData.find(item => item.id === index.id);
        setModalData(selectedTableData);
    };

    const handleEditButton = (e) => {
        setAdd(false);
        setEdit(true);
        const index = dummyData[parseInt(e.target.name)];
        fetchPreFillData(index);
        setShowModal(true);
    };

    const handleActivate = (e) => {
        const tempData = [...dummyData];
        const index = tempData[parseInt(e.target.name)];
        index.isActive = !index.isActive;
        setDummyData(tempData);
        toast.success(`${index.name} has been ${index.isActive ? 'activated' : 'deactivated'}`);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        // console.log(modalData);

        const requiredFields = ['name', 'branch', 'description'];
        const emptyFields = requiredFields.filter(field => !modalData[field]);

        if (emptyFields.length > 0) {
            emptyFields.forEach(field => {
                toast.error(`Please enter ${field.split('_').join(" ")} field`);
            });
            return false;
        }

        if (add) {
            const newFaculty = { ...modalData, id: dummyData.length + 1, isActive: true };
            setDummyData([...dummyData, newFaculty]);
            toast.success('Course added successfully');
            setAdd(false);
        } else if (edit) {
            const tempData = dummyData.map(item => (item.id === modalData.id ? modalData : item));
            setDummyData(tempData);
            toast.success('Course updated successfully');
            setEdit(false);
        }
        setShowModal(false);
    };

    const handleAddFormChange = (e) => {
        const tempData = { ...modalData };
        tempData[e.target.name] = e.target.value;
        setModalData(tempData);
    };

    return (
        <div className='w-full h-full'>
            <div className="flex justify-between p-3 w-full">
                <h1 className="uppercase text-xl">Course</h1>
                <button onClick={handleAdd} className="py-1 px-2 rounded-md bg-primary text-white/80 text-xl uppercase cursor-pointer">
                    Add
                </button>
            </div>

            {
                !loading && <div className="relative mt-12 flex flex-col gap-4">
                    {dummyData.map((item, index) => (
                        <div className="min-w-full mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
                            <div className='flex flex-wrap justify-between items-center'>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{item?.name}</h5>
                                <button onClick={handleEditButton} className='py-1 px-2 rounded-md bg-primary text-white/80 cursor-pointer'>Edit</button>
                            </div>
                            <div className='grid grid-cols-2 gap-2'>
                                <p className="text-gray-700">Description: {item?.description}</p>
                                <div className='flex items-center justify-between'>
                                    <p className="text-gray-700">Branch: {item?.branch}</p>
                                    <button onClick={handleActivate} value={item.isActive} name={index} className={`py-1 px-2 rounded-md text-white/80 cursor-pointer ${item.isActive ? "bg-red-900" : "bg-green-600"}`}>{item.isActive ? "Deactivate" : "Activate"}</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[9999] flex justify-center items-center' id='outside' onClick={handleOnClose}>
                    <div className='shadow-lg h-7/8 w-6/12 mx-auto bg-white rounded-xl p-8 overflow-y-scroll z-[40000]'>
                        <div className='text-center text-3xl font-bold mb-8'>{add ? 'Add' : 'Edit'} Course</div>

                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col'>
                                <div className='flex justify-between flex-wrap'>
                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='name'>Name</label>
                                        <input
                                            type="text"
                                            name='name'
                                            required
                                            placeholder={`Enter course name...`}
                                            onChange={handleAddFormChange}
                                            value={modalData["name"] || ""}
                                            className="form-control w-full"
                                        />
                                    </div>

                                    <div className='flex flex-col gap-2 w-[49%]'>
                                        <label htmlFor='branch'>Branch</label>
                                        <select
                                            name='branch'
                                            onChange={handleAddFormChange}
                                            value={modalData.branch}
                                            className="form-control w-full"
                                        >
                                            <option value="" disabled>Select branch</option>
                                            {branches.map((branch, index) => (
                                                <option key={index} value={branch}>{branch}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className='flex justify-between flex-wrap mt-5'>
                                    <div className='flex flex-col gap-2 w-full'>
                                        <label htmlFor='description'>Description</label>
                                        <input
                                            type="text"
                                            name='description'
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

export default Course2;