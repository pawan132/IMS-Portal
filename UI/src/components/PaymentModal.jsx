import React, { useEffect, useState } from 'react';

const PaymentModal = ({ baseFees, paymentData, setPaymentData, isOpen, onClose, isEdit, setIsEdit }) => {
    console.log(baseFees);
    const [modalData, setModalData] = useState({ baseFees: baseFees });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isMulti, setIsMulti] = useState(false);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [payments, setPayments] = useState([{}]);

    const validateForm = () => {
        const errors = {};

        // Validation for baseFees
        if (!modalData.baseFees) {
            errors.baseFees = 'Base Fees is required';
        } else if (modalData.baseFees < 0) {
            errors.baseFees = 'Base Fees must be greater than or equal to 0';
        }

        // Validation for tax
        if (modalData.tax === undefined || modalData.tax === null || modalData.tax === '') {
            errors.tax = 'Tax is required';
        } else if (modalData.tax < 0) {
            errors.tax = 'Tax must be greater than or equal to 0';
        }

        if (isMulti) {
            payments.forEach((payment, index) => {
                if (!payment.date) {
                    errors[`date${index}`] = 'Date is required';
                }
                if (payment.amount === undefined || payment.amount === null || payment.amount === '') {
                    errors[`amount${index}`] = 'Amount is required';
                } else if (payment.amount < 0) {
                    errors[`amount${index}`] = 'Amount should be greater than or equal to 0';
                }
            });
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        console.log({ modalData, payments });
        setPaymentData({ modalData, payments, isOneTime: !isMulti })
        // Add your submit logic here
        setLoading(false);
        onClose()
    };

    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setModalData((prevData) => {
            const updatedData = { ...prevData };
            updatedData[name] = value;
            return updatedData;
        });
        console.log({ modalData, payments });
    };

    const handlePaymentChange = (index, field, value) => {
        setPayments((prevPayments) => {
            let updatedPayments = [...prevPayments];
            updatedPayments[index][field] = value;

            if (field === 'amount') {
                updatedPayments = updatedPayments.filter((payment) => payment.amount !== '');
                const totalPaid = updatedPayments.reduce((acc, payment) => acc + Number(payment.amount || 0), 0);
                setRemainingAmount(Math.max(modalData.netFees - totalPaid, 0));

                if (totalPaid < modalData.netFees && index === updatedPayments.length - 1 && value) {
                    updatedPayments.push({ date: '', amount: '' });
                }

                if (totalPaid >= modalData.netFees) {
                    updatedPayments = updatedPayments.filter((payment) => payment.amount);
                }
            }

            return updatedPayments;
        });
    };

    useEffect(() => {
        const baseFees = Number(modalData.baseFees) || 0;
        const discount = Number(modalData.discount) || 0;
        const scholar = Number(modalData.scholar) || 0;
        const tax = Number(modalData.tax) || 0;

        const grossAmount = baseFees - discount - scholar;
        const netFees = grossAmount + (grossAmount * (tax / 100));

        setModalData((prevData) => ({
            ...prevData,
            grossFees: grossAmount > 0 ? grossAmount : 0,
            netFees: Math.round(netFees > 0 ? netFees : 0),
        }));
    }, [modalData.baseFees, modalData.discount, modalData.scholar, modalData.tax]);

    useEffect(() => {
        if (isMulti) {
            const totalPaid = payments.reduce((acc, payment) => acc + Number(payment.amount || 0), 0);
            setRemainingAmount(Math.max(modalData.netFees - totalPaid, 0));
        }
    }, [isMulti, modalData.netFees, payments]);

    if (!isOpen) return null;

    return (
        isOpen && (
            <div className='fixed inset-0 z-[9999] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
                <div className='shadow-lg h-[60vh] w-6/12 mx-auto bg-white rounded-xl p-8 overflow-y-auto z-[40000]'>
                    <div className='text-center text-3xl font-bold'>Payment Details</div>
                    <div className='flex flex-col'>
                        <div className='grid grid-cols-3 gap-5 mt-10'>
                            <div className='flex flex-col gap-2 w-full'>
                                <label htmlFor='baseFees'>Base Fees</label>
                                <input
                                    type='number'
                                    name='baseFees'
                                    placeholder='Enter base fees...'
                                    onChange={handleAddFormChange}
                                    value={modalData.baseFees || ''}
                                    className='form-control w-full'
                                    readOnly
                                />
                                {errors.baseFees && <span className='text-sm text-red-500'>{errors.baseFees}</span>}
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label htmlFor='discount'>Discount</label>
                                <input
                                    type='number'
                                    name='discount'
                                    placeholder='Enter discount...'
                                    onChange={handleAddFormChange}
                                    value={modalData.discount || ''}
                                    className='form-control w-full'
                                />
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label htmlFor='scholar'>Scholar</label>
                                <input
                                    type='number'
                                    name='scholar'
                                    placeholder='Enter scholar...'
                                    onChange={handleAddFormChange}
                                    value={modalData.scholar || ''}
                                    className='form-control w-full'
                                />
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label htmlFor='grossFees'>Gross Fees</label>
                                <input
                                    type='number'
                                    name='grossFees'
                                    value={modalData.grossFees || ''}
                                    className='form-control w-full'
                                    readOnly
                                />
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label htmlFor='tax'>Tax (%)</label>
                                <input
                                    type='number'
                                    name='tax'
                                    placeholder='Enter tax (%)...'
                                    onChange={handleAddFormChange}
                                    value={modalData.tax || ''}
                                    className='form-control w-full'
                                />
                                {errors.tax && <span className='text-sm text-red-500'>{errors.tax}</span>}
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label htmlFor='netFees'>Net Fees</label>
                                <input
                                    type='number'
                                    name='netFees'
                                    value={modalData.netFees || ''}
                                    className='form-control w-full'
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='flex mt-10'>
                            <div className='flex items-center me-4'>
                                <input
                                    id='inline-radio'
                                    type='radio'
                                    checked={!isMulti}
                                    name='paymentMode'
                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                    onChange={() => setIsMulti(false)}
                                />
                                <label htmlFor='inline-radio' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                    One Time Payment
                                </label>
                            </div>
                            <div className='flex items-center me-4'>
                                <input
                                    id='inline-2-radio'
                                    type='radio'
                                    checked={isMulti}
                                    name='paymentMode'
                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                    onChange={() => setIsMulti(true)}
                                />
                                <label htmlFor='inline-2-radio' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                    Multiple Payments
                                </label>
                            </div>
                        </div>

                        {isMulti && (
                            <div className='mt-10'>
                                {payments.map((payment, index) => (
                                    <div key={index} className='grid grid-cols-2 gap-5 mb-4'>
                                        <div className='flex flex-col gap-2 w-full'>
                                            <label htmlFor={`date${index}`}>Date</label>
                                            <input
                                                type='date'
                                                name={`date${index}`}
                                                placeholder='Select date...'
                                                onChange={(e) => handlePaymentChange(index, 'date', e.target.value)}
                                                value={payment.date || ''}
                                                className='form-control w-full'
                                            />
                                            {errors[`date${index}`] && <span className='text-sm text-red-500'>{errors[`date${index}`]}</span>}
                                        </div>
                                        <div className='flex flex-col gap-2 w-full'>
                                            <label htmlFor={`amount${index}`}>Amount</label>
                                            <input
                                                type='number'
                                                name={`amount${index}`}
                                                placeholder='Enter amount...'
                                                onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                                                value={payment.amount || ''}
                                                className='form-control w-full'
                                            />
                                            {errors[`amount${index}`] && <span className='text-sm text-red-500'>{errors[`amount${index}`]}</span>}
                                        </div>
                                    </div>
                                ))}
                                <div className='flex flex-col gap-2 w-full mt-4'>
                                    <label htmlFor='remainingAmount'>Remaining Amount</label>
                                    <input
                                        type='number'
                                        name='remainingAmount'
                                        value={remainingAmount || ''}
                                        className='form-control w-full'
                                        readOnly
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => { setIsEdit(false); onClose(); }}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded" disabled={loading}
                            >
                                {loading ? <span>Loading...</span> : <span>Submit</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default PaymentModal;
