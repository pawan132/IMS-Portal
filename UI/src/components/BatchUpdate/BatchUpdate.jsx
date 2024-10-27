import React, { useState, useEffect } from 'react';
import axiosPrivateInstance from '../../utils/axiosConfig';
import toast from 'react-hot-toast';

const BatchUpdate = ({ onClose }) => {
    const [batchList, setBatchList] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [remark, setRemark] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBatchIDs = async () => {
            try {
                const response = await axiosPrivateInstance.get('/api/getBatchIDs'); // Adjust the endpoint accordingly
                setBatchList(response.data);
            } catch (error) {
                toast.error('Failed to fetch batch IDs');
            }
        };
        fetchBatchIDs();
    }, []);

    const handleSubmit = async () => {
        const validationErrors = {};
        if (!selectedBatch) validationErrors.selectedBatch = 'Batch selection is required';
        if (!remark) validationErrors.remark = 'Remark is required';

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            const dataToSend = {
                batchId: selectedBatch,
                remark: remark,
            };
            await axiosPrivateInstance.post('/api/submitBatchForm', dataToSend); // Adjust the endpoint accordingly
            toast.success('Form submitted successfully');
            onClose();
        } catch (error) {
            toast.error('Error submitting form');
        }
    };

    return (
        <div className="modal-content p-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="batchSelection">Select Batch:</label>
                    <select
                        id="batchSelection"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="form-control w-full"
                    >
                        <option value="">Select a batch</option>
                        {batchList.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                                {batch.name}
                            </option>
                        ))}
                    </select>
                    {errors.selectedBatch && <span className="text-sm text-red-500">{errors.selectedBatch}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="remark">Remark:</label>
                    <input
                        type="text"
                        id="remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className="form-control w-full"
                    />
                    {errors.remark && <span className="text-sm text-red-500">{errors.remark}</span>}
                </div>
            </div>

            <div className="flex justify-between mt-4 gap-4">
                <button
                    className="py-1 px-4 text-l rounded-md bg-primary text-white cursor-pointer"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                <button
                    className="py-1 px-4 text-l rounded-md bg-gray-400 text-white cursor-pointer"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default BatchUpdate;
