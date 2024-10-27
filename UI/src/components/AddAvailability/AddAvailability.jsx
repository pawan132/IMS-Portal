import React, { useState } from 'react';
import axiosPrivateInstance from '../../utils/axiosConfig';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';

const AddAvailability = ({ onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [availability, setAvailability] = useState(
        Array(7).fill(null).map(() => [{ startTime: '', endTime: '' }])
    );
    const [errors, setErrors] = useState({});
    const [showPreview, setShowPreview] = useState(false);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleChange = (dayIndex, slotIndex, field, value) => {
        const newAvailability = [...availability];
        newAvailability[dayIndex][slotIndex][field] = value;
        setAvailability(newAvailability);
    };

    const handleDayStatusChange = (dayIndex, status) => {
        const newAvailability = [...availability];
        newAvailability[dayIndex] = status === 'notAvailable' ? [] : [{ startTime: '', endTime: '' }];
        setAvailability(newAvailability);
    };

    const handleAddSlot = (dayIndex) => {
        const newAvailability = [...availability];
        newAvailability[dayIndex].push({ startTime: '', endTime: '' });
        setAvailability(newAvailability);
    };

    const handleDeleteSlot = (dayIndex, slotIndex) => {
        const newAvailability = [...availability];
        newAvailability[dayIndex].splice(slotIndex, 1);
        setAvailability(newAvailability);
    };

    const handleSubmit = async () => {
        const errors = {};
        if (!startDate) errors.startDate = 'Start date is required';
        if (!endDate) errors.endDate = 'End date is required';
        setErrors(errors);
        if (Object.keys(errors).length) return;

        const dataToSend = [];
        availability.forEach((slots, index) => {
            if (slots === 'notAvailable') {
                return;
            }
            slots.forEach(slot => {
                if (slot.startTime && slot.endTime) {
                    dataToSend.push({
                        date: startDate,
                        day: daysOfWeek[index],
                        startTime: slot.startTime,
                        endTime: slot.endTime
                    });
                }
            });
        });

        try {
            await axiosPrivateInstance.post('/FacultyAvailable', dataToSend);
            toast.success('Availability added successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding availability');
        }
    };

    return (
        <div className="modal-content">
            <div className="flex justify-between flex-wrap mt-5 gap-4">
                <div className="flex flex-col gap-2 w-[48%]">
                    <label htmlFor="startDate">
                        Start Date:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="form-control w-full"
                        />
                        {errors.startDate && <span className="text-sm text-red-500">{errors.startDate}</span>}
                    </label>
                </div>

                <div className="flex flex-col gap-2 w-[48%]">
                    <label htmlFor="endDate">
                        End Date:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="form-control w-full"
                        />
                        {errors.endDate && <span className="text-sm text-red-500">{errors.endDate}</span>}
                    </label>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <label className="w-1/6"></label>
                    <label className="w-2/6 text-center">Start Time*</label>
                    <label className="w-2/6 text-center">End Time*</label>
                    <label className="w-1/6"></label>
                </div>

                {daysOfWeek.map((day, dayIndex) => (
                    <div key={dayIndex} className="flex flex-col gap-2 mb-4">
                        <div className="flex ">
                            <h3 className="w-1/6">{day}</h3>
                            <div className="flex w-4/6 flex-col gap-2">
                                {availability[dayIndex]?.map((slot, slotIndex) => (
                                    <div key={slotIndex} className="flex justify-between gap-2">
                                        <input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={(e) => handleChange(dayIndex, slotIndex, 'startTime', e.target.value)}
                                            className="form-control w-1/2"
                                        />
                                        <input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) => handleChange(dayIndex, slotIndex, 'endTime', e.target.value)}
                                            className="form-control w-1/2"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2 w-1/6">
                                <button
                                    className="py-1 px-2 w-8 h-8 text-xl rounded-md bg-primary text-white cursor-pointer"
                                    onClick={() => handleDeleteSlot(dayIndex)}
                                >-</button>
                                <button
                                    className="py-1 px-2 w-8 h-8 text-xl rounded-md bg-primary text-white cursor-pointer"
                                    onClick={() => handleAddSlot(dayIndex)}
                                >+
                                </button>
                                <button
                                    className="py-1 px-2 w-8 h-8 text-xl rounded-md bg-primary text-white cursor-pointer"
                                    onClick={() => handleDayStatusChange(dayIndex, 'notAvailable')}
                                >⊘
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 gap-4">
                <button
                    className="py-1 px-4 text-l rounded-md bg-primary text-white cursor-pointer"
                    onClick={() => setShowPreview(true)}
                >Preview
                </button>
                <button
                    className="py-1 px-4 text-l rounded-md bg-primary text-white cursor-pointer"
                    onClick={onClose}
                >    Close
                </button>
            </div>
            {showPreview && (
                <Modal
                    showModal={showPreview}
                    title="Preview Availability"
                    formFields={[]}
                    modalData={{}}
                    handleOnClose={() => setShowPreview(false)}
                    additionalContent={
                        <div>
                            <p>Start Date: {startDate}</p>
                            <p>End Date: {endDate}</p>
                            <table className="table-auto w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">Day</th>
                                        <th className="px-4 py-2">Start Time</th>
                                        <th className="px-4 py-2">End Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {availability.map((daySlots, dayIndex) => (
                                        <React.Fragment key={dayIndex}>
                                            {daySlots.length > 0 && daySlots.map((slot, slotIndex) => (
                                                <tr key={slotIndex}>
                                                    {slotIndex === 0 && (
                                                        <td className="px-4 py-2 text-left" rowSpan={daySlots.length}>
                                                            {daysOfWeek[dayIndex]}
                                                        </td>
                                                    )}
                                                    <td className="px-4 py-2 text-center">{slot.startTime || 'N/A'}</td>
                                                    <td className="px-4 py-2 text-center">{slot.endTime || 'N/A'}</td>
                                                </tr>
                                            ))}
                                            {daySlots.length === 0 && (
                                                <tr>
                                                    <td className="px-4 py-2 text-left">{daysOfWeek[dayIndex]}</td>
                                                    <td className="px-4 py-2 text-center" colSpan="2">Unavailable</td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                    handleSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default AddAvailability;
