import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import {axiosPrivateInstance} from 'axios'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FacultyAvailability = ({ show, close }) => {
  // console.log(close)
  const [availability, setAvailability] = useState(
    weekdays.reduce((acc, day) => {
      acc[day] = [{ startTime: '', endTime: '' }];
      return acc;
    }, {})
  );
  const [error, setError] = useState('');

  const handleTimeChange = (day, index, field, value) => {
    const newAvailability = { ...availability };
    newAvailability[day][index][field] = value;
    setAvailability(newAvailability);
  };

  const addTimeSlot = (day) => {
    const newAvailability = { ...availability };
    if (newAvailability[day][0].unavailable) {
      newAvailability[day] = [{ startTime: '', endTime: '' }];
    } else {
      newAvailability[day].push({ startTime: '', endTime: '' });
    }
    setAvailability(newAvailability);
  };

  const removeTimeSlot = (day, index) => {
    const newAvailability = { ...availability };
    if (newAvailability[day].length > 1) {
      newAvailability[day].splice(index, 1);
    } else {
      newAvailability[day][0] = { unavailable: true };
    }
    setAvailability(newAvailability);
  };

  const handleUnavailable = (day) => {
    const newAvailability = { ...availability };
    newAvailability[day] = [{ unavailable: true }];
    setAvailability(newAvailability);
  };

  // const fetchStates = async () => {
  //   try {
  //     const state = await axiosPrivateInstance.get('/master/states');
  //     // console.log(state.data.data);
  //     setStateData(state.data.data)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const validateAndSubmit = () => {
    const newAvailability = { ...availability };
    let valid = true;

    weekdays.forEach((day) => {
      if (newAvailability[day].length === 1 && newAvailability[day][0].unavailable) {
        return;
      }

      newAvailability[day].forEach((slot) => {
        if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
          valid = false;
        }
      });

      if (newAvailability[day].every(slot => !slot.startTime || !slot.endTime)) {
        valid = false;
      }
    });

    if (valid) {
      setError('');

      

      // console.log('Submitting availability:', availability);
      close(); 
    } else {
      setError('Please ensure all time slots are valid and properly filled out.');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-[9999] flex justify-center items-center overflow-auto">
      <div className="relative shadow-lg h-[90vh] w-10/12 md:w-8/12 lg:w-6/12 mx-auto bg-white rounded-xl p-8 overflow-y-auto z-[40000]">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">General Availability</h2>

        {weekdays.map((day) => (
          <div key={day} className="day-container flex items-start mt-5 border-b border-gray-200 pb-4 last:border-none">
            <h3 className="text-lg font-semibold w-1/5">{day}</h3>
            <div className="flex-1 flex items-start gap-4">
              <div className="flex flex-col flex-1 gap-3">
                {availability[day].map((slot, index) => (
                  <div key={index} className="time-slot flex items-center gap-3 bg-gray-100 p-3 rounded border border-gray-300 shadow-sm">
                    {slot.unavailable ? (
                      <span className="text-red-500 font-medium">Unavailable</span>
                    ) : (
                      <>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleTimeChange(day, index, 'startTime', e.target.value)}
                          className="border rounded px-3 py-1 text-sm"
                        />
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleTimeChange(day, index, 'endTime', e.target.value)}
                          className="border rounded px-3 py-1 text-sm"
                        />
                        <button
                          onClick={() => removeTimeSlot(day, index)}
                          className="text-red-500 text-lg"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex gap-3 w-4/4">
                <button
                  onClick={() => addTimeSlot(day)}
                  className="btn flex items-center gap-2 bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600"
                >
                  <FaPlus /> Add Slot
                </button>
                <button
                  onClick={() => handleUnavailable(day)}
                  className={`btn flex items-center gap-2 rounded py-2 px-4 ${availability[day][0]?.unavailable ? 'bg-gray-500' : 'bg-red-500'} text-white hover:bg-red-600`}
                >
                  <FaTimes /> {'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {error && <div aria-live="assertive" className="border border-red-500 bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}
        <div className="flex justify-center mt-6">
          <button
            onClick={validateAndSubmit}
            className="btn flex items-center gap-2 bg-green-500 text-white rounded py-2 px-4 hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyAvailability;
