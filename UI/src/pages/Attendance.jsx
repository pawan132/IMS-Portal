import React, { useEffect, useState } from 'react';
import CalendarView from '../components/Calendar/CalendarView';
import toast from 'react-hot-toast';
import axiosPrivateInstance from '../utils/axiosConfig';
import { ToolbarProps } from 'react-big-calendar';
import Select from "react-select";
const moment = require('moment-timezone');



const Attendance = () => {

  const eventStyleGetter = (event) => {
    let backgroundColor = event.status === "P" ? "#28a745" : "#dc3545";
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const calendarView = ['month', 'day'];

  const Legend = () => (
    <div style={{ marginBottom: '10px', display: 'flex', gap: 20, justifyContent: 'flex-end' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ backgroundColor: ' #28a745', width: '20px', height: '20px', marginRight: '8px' }}></div>
        <span>Present</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ backgroundColor: '#dc3545', width: '20px', height: '20px', marginRight: '8px' }}></div>
        <span>Absent</span>
      </div>
    </div>
  );

  
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [selectedstudentData, setSelectedStudentData] = useState(null);
  const [selectedOption, setSelectedOption] = useState('student');
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty,setSelectedFaculty] = useState(null);
  const [offhrs, setOffhrs] = useState({});
  
  
  const handleAttendanceMode = (event) => {
  setSelectedOption(event.target.value);
  };

  const fetchAllFacultybyBranchId = async () => {
    try {
      const response = await axiosPrivateInstance.get(`/faculty/branch`, { brachId: localStorage.getItem('branchId') });
      const formattedResponse = response.data.data.map(data => ({
        value: data.id,
        label: data.User.fullName,
      }));
      setFaculty(formattedResponse);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  
  const fetchAllStudentsbyBranchId = async () => {
    try {
      const response = await axiosPrivateInstance.get(`/student/branch`, { brachId: localStorage.getItem('branchId') });
      console.log(response.data.data);

      const formattedResponse = response.data.data.map(data => ({
        value: data.id,
        label: data.User.fullName,
      }));
      setStudentData(formattedResponse);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchStudentAttendance = async () => {
    try {
      // attendanceData.clear();
      const response = await axiosPrivateInstance.post(`/student/attendance`, { branchId: localStorage.getItem('branchId') });
      console.log(response.data.data);

      const formattedAttendanceData = response.data.data.map(data => ({
        title: data.title,
        start: new Date(data.start),
        end: new Date(data.end),
        status: data.status,
        studentId: data.studentId
      }));
      setAttendanceData(formattedAttendanceData);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchFacultyAttendance = async () => {
    try {
      // attendanceData.clear();
      const response = await axiosPrivateInstance.post(`/faculty/attendance`, { branchId: localStorage.getItem('branchId') });
      console.log(response.data.data);

      const formattedAttendanceData = response.data.data.map(data => ({
        title: data.title,
        start: new Date(data.start),
        end: new Date(data.end),
        status: data.status,
        facultyId: data.facultyId
      }));
      setAttendanceData(formattedAttendanceData);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchAllStudentsbyBatches = async () => {
    try {
      console.log('Requested this api');
      
      const response = await axiosPrivateInstance.post(`/student/bybatch`, { brachId: localStorage.getItem('branchId'),facultyId:'31'});
      console.log(response.data.data);

      // const formattedResponse = response.data.data.map(data => ({
      //   value: data.id,
      //   label: data.User.fullName,
      // }));
      // setStudentData(formattedResponse);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchAllBatchesbyFaculty = async () => {
    try {
      console.log('Requested this api');
      
      const response = await axiosPrivateInstance.post(`/batch/byFaculty`, { branchId: localStorage.getItem('branchId'),facultyId:9});
      console.log(response.data.data);

      // const formattedResponse = response.data.data.map(data => ({
      //   value: data.id,
      //   label: data.User.fullName,
      // }));
      // setStudentData(formattedResponse);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleStudentChange = (selectedOption) => {
    setSelectedStudentData(selectedOption ? selectedOption.value : null);
  };

  const handleFacultyChange = (selectedOption) => {
    setSelectedFaculty(selectedOption ? selectedOption.value : null);
  };

  const filteredAttendanceData = selectedOption === 'student' 
    ? (selectedstudentData ? attendanceData.filter(data => data.studentId === selectedstudentData) : attendanceData)
    : (selectedFaculty ? attendanceData.filter(data => data.facultyId === selectedFaculty) : attendanceData);



  useEffect(() => {
    if(selectedOption ==='student'){
      fetchAllStudentsbyBranchId();
      fetchStudentAttendance();
      fetchAllStudentsbyBatches();
      fetchAllBatchesbyFaculty();
    }
    else{
      fetchAllFacultybyBranchId();
      fetchFacultyAttendance();
    }
  
  }, [selectedOption]);


  return (
    <div className="Attendance">
     <div className='flex justify-between'>
        <div className="flex">
          <div className='flex items-center me-4 '>
            <input
              id='inline-radio'
              type='radio'
              value='student'
              checked={selectedOption === 'student'}
              name='student'
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
            onChange={ handleAttendanceMode}
            />
            <label htmlFor='inline-radio' className='ms-2'>
              Student
            </label>
          </div>
          <div className='flex items-center me-4'>
            <input
              id='inline-2-radio'
              type='radio'
              value='faculty'
              checked={selectedOption === 'faculty'}
              name='faculty'
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
            onChange={ handleAttendanceMode}
            />
            <label htmlFor='inline-2-radio' className='ms-2 '>
              Faculty
            </label>
          </div>
        </div>
        <div className="flex flex-col">
          <Legend></Legend>
        </div>
      </div>
      <br />
      <div className="flex gap-20 justify-between">

       {selectedOption=='student'?  <div className='flex flex-col gap-2 w-[20%]'>
          <label htmlFor='facultyId'>Select Student*</label>
          <Select
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000,
              }),
            }}
            name='Student'
            value={selectedstudentData ? { value: selectedstudentData, label: studentData.find(stu => stu.value === selectedstudentData)?.label } : null}
            onChange={handleStudentChange}
            options={studentData}
            className="form-control w-full"
          />
        </div> : 
         <div className='flex flex-col gap-2 w-[20%]'>
         <label htmlFor='facultyId'>Faculty*</label>
         <Select
           name='facultyId'
           value={selectedFaculty ? { value: selectedFaculty, label: faculty.find(fac => fac.value === selectedFaculty)?.label } : null}
           onChange={handleFacultyChange}
           options={faculty}
           className="form-control w-full"
         />
       </div> 
        }  
     
      </div>
      <br />
      <CalendarView
        data={filteredAttendanceData}
        eventStyle={eventStyleGetter}
        calendarView={calendarView} 
        offHoursByDay={offhrs}/>
    </div>
  );
}

export default Attendance;