import React, { useEffect, useState } from 'react';
import CalendarView from '../components/Calendar/CalendarView';
import toast from 'react-hot-toast';
import Select from "react-select";
import axiosPrivateInstance from '../utils/axiosConfig';
const moment = require('moment-timezone');

const FacultySchedule = () => {
  const [batches, setBatches] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [offhrs, setOffhrs] = useState({
    1: { start: 24, end: 0 },  // Monday
    2: { start: 24, end: 0 },  // Tuesday
    3: { start: 24, end: 0 },  // Wednesday
    4: { start: 24, end: 0 },  // Thursday
    5: { start: 24, end: 0 },  // Friday
    6: { start: 24, end: 0 },  // Saturday
    0: { start: 24, end: 0 },  // Sunday
  });

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

  const fetchAllBatches = async () => {
    try {
      const response = await axiosPrivateInstance.post(`/batch/calendar`, { branchId: localStorage.getItem('branchId') });
      const formattedBatches = response.data.data.map(batch => ({
        title: batch.batch_name,
        start: new Date(batch.startDateTime),
        end: new Date(batch.endDateTime),
        facultyId: batch.facultyId
      }));

      setBatches(formattedBatches);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleFacultyChange = (selectedOption) => {
    // console.log(selectedOption.value)
    setSelectedFaculty(selectedOption ? selectedOption.value : null);
    getFacultySchedule(selectedOption.value);
  };

  const getFacultySchedule = async (selectedFacultyId) => {
    try {
      const response = await axiosPrivateInstance.get(`faculty/faculty/schedule?facultyId=${selectedFacultyId}`);
      const offHoursByDay = {
        1: { start: 24, end: 0 },  // Monday
        2: { start: 24, end: 0 },  // Tuesday
        3: { start: 24, end: 0 },  // Wednesday
        4: { start: 24, end: 0 },  // Thursday
        5: { start: 24, end: 0 },  // Friday
        6: { start: 24, end: 0 },  // Saturday
        0: { start: 24, end: 0 },  // Sunday
      };
      const timeToDecimal = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours + minutes / 60 + seconds / 3600;
      };
      // console.log("response.data",response.data)
      response.data.data.forEach(element => {
        let dayIndex;

        switch (element.day) {
          case 'Monday':
            dayIndex = 1;
            break;
          case 'Tuesday':
            dayIndex = 2;
            break;
          case 'Wednesday':
            dayIndex = 3;
            break;
          case 'Thursday':
            dayIndex = 4;
            break;
          case 'Friday':
            dayIndex = 5;
            break;
          case 'Saturday':
            dayIndex = 6;
            break;
          case 'Sunday':
            dayIndex = 0;
            break;
          default:
            return;
        }

        offHoursByDay[dayIndex] = {
          start: element.startTime ? timeToDecimal(element.startTime) : 0,
          end: element.endTime ? timeToDecimal(element.endTime) : 24,
        };
        // console.log("offHoursByDay", offHoursByDay);
      });

      // console.log("offHoursByDay2", offHoursByDay);
      setOffhrs(offHoursByDay);

    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const filteredBatches = selectedFaculty
    ? batches.filter(batch => batch.facultyId === selectedFaculty)
    : batches;

  useEffect(() => {
    fetchAllFacultybyBranchId();
    fetchAllBatches();
  }, []);

  return (
    <div className="FacultySchedule">
      <Legend></Legend>
      <div className='flex flex-col gap-2 w-[20%]'>
        <label htmlFor='facultyId'>Faculty*</label>
        
        <Select
          name='facultyId'
          value={selectedFaculty ? { value: selectedFaculty, label: faculty.find(fac => fac.value === selectedFaculty)?.label } : null}
          onChange={handleFacultyChange}
          options={faculty}
          className="form-control w-full"
          styles={{
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
          }}
        />
      </div>

      <br />

      <CalendarView data={filteredBatches} offHoursByDay={offhrs} />
    </div>
  );
};

export default FacultySchedule;

const Legend = () => (
  <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
      <div style={{
        backgroundColor: 'lightgrey', 
        width: '20px', 
        height: '20px', 
        marginRight: '8px', 
        border: '1px solid #ccc'
      }}></div>
      <span>Off Hours</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        backgroundColor: 'white', 
        width: '20px', 
        height: '20px', 
        marginRight: '8px', 
        border: '1px solid #ccc'
      }}></div>
      <span>Free Slots</span>
    </div>
  </div>
);
