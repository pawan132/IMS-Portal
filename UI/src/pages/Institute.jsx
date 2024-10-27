import React, { useCallback, useEffect, useState } from 'react'
import InstituteCard from '../components/dashboard/InstituteCard'
import toast from 'react-hot-toast';
import axiosPrivateInstance from '../utils/axiosConfig';
import InstituteModal from '../components/InstituteModal';

const Institute = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [instituteDetails, setInstituteDetails] = useState(null);
    const [isInstituteEdit, setIsInstituteEdit] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const fetchInstituteDetails = useCallback(async () => {
        const instituteId = localStorage.getItem('instituteId');
        const roleId = localStorage.getItem('roleId');

        // console.log('instituteId: ', instituteId);
        // console.log('roleId: ', roleId);
        // console.log('Parsed roleId: ', Number(roleId));
        // console.log('Condition check: ', instituteId === 'null', Number(roleId) === 2);

        if ((instituteId === null || instituteId === "null") && Number(roleId) === 2) {
            setIsModalOpen(true);
        } else if (instituteId !== null && instituteId !== "null" && Number(roleId) === 2) {
            setIsModalOpen(false);
        }

        if (instituteId !== null) {
            try {
                const response = await axiosPrivateInstance.get(`/institute/${instituteId}`);
                setInstituteDetails(response.data.data);
            } catch (error) {
                console.error('Error fetching institute details:', error);
                toast.error(error.response?.data?.message);
            }
        }
    }, []);

    useEffect(() => {
        fetchInstituteDetails();
        setRefresh(false);
    }, [fetchInstituteDetails, refresh]);

    const handleEditButton = () => {
        setIsInstituteEdit(true);
        setIsModalOpen(true);
    }

    return (
        <div>
            <InstituteCard institute={instituteDetails} handleEditButton={handleEditButton} />

            <InstituteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} institute={instituteDetails} isEdit={isInstituteEdit} setIsEdit={setIsInstituteEdit} setRefresh={setRefresh} />
        </div>
    )
}

export default Institute