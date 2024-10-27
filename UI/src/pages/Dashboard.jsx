import React, { useState, useEffect, useCallback } from 'react';
import axiosPrivateInstance from '../utils/axiosConfig';
import DashboardCard from '../components/dashboard/DashboardCard';
import BarChart from '../assets/charts/bar.png'
import GraphChart from '../assets/charts/graph.png'
import LineChart from '../assets/charts/line.png'
import toast from 'react-hot-toast';
import InstituteModal from '../components/InstituteModal';
const roleId = localStorage.getItem('roleId');
const fetchFrom = roleId !== '2' ? 'branch' : 'institute';

const Dashboard = () => {
  const [dashboardCardDetails, setDashboardCardDetails] = useState([]);
  const [isInstituteEdit, setIsInstituteEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instituteDetails, setInstituteDetails] = useState(null);
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

    try {
      const response = await axiosPrivateInstance.get(`/dashboard/dashboardCards/${fetchFrom}`);
      setDashboardCardDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching institute details:', error);
      toast.error(error.response?.data?.message)
    }
  }, []);

  useEffect(() => {
    fetchInstituteDetails();
    setRefresh(false);
  }, [fetchInstituteDetails, refresh]);

  return (
    <div className='w-100 h-100'>
      <div className={`mt-5 grid grid-cols-4 gap-5 w-full`}>
        {/* {roleId === '2' && <DashboardCard name={'Branch'} number={dashboardCardDetails.branch ? dashboardCardDetails.branch.length : '0'} />} */}
        <DashboardCard name={'Students'} number={dashboardCardDetails.students ? dashboardCardDetails.students.length : '0'} />
        <DashboardCard name={'Courses'} number={dashboardCardDetails.courses ? dashboardCardDetails.courses.length : '0'} />
        <DashboardCard name={'Faculty'} number={dashboardCardDetails.faculty ? dashboardCardDetails.faculty.length : '0'} />
        <DashboardCard name={'Batch'} number={dashboardCardDetails.batch ? dashboardCardDetails.batch.length : '0'} />
      </div>

      <div className='grid grid-cols-2 gap-5 mt-10'>
        <img src={BarChart} alt="" className='w-full' />
        <img src={GraphChart} alt="" className='w-full' />
      </div>
      <div className='grid grid-cols-2 gap-5 mt-5'>
        <img src={LineChart} alt="" className='w-full' />
        <img src={BarChart} alt="" className='w-full' />
      </div>

      <InstituteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} institute={instituteDetails} isEdit={isInstituteEdit} setIsEdit={setIsInstituteEdit} setRefresh={setRefresh} />
    </div>
  );
};

export default Dashboard;