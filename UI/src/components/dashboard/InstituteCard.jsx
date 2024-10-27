import React from 'react';

const InstituteCard = ({ institute, handleEditButton }) => {
    return (
        <div className="min-w-full mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
            <div className='flex flex-wrap justify-between items-center'>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{institute?.name}</h5>
                <button onClick={handleEditButton} className='py-1 px-2 rounded-md bg-primary text-white/80 cursor-pointer'>Edit</button>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <p className="text-gray-700">Email: {institute?.email}</p>
                <p className="text-gray-700">Mobile: {institute?.mobile}</p>
                <p className="text-gray-700">Website: {institute?.website}</p>
                <p className="text-gray-700">Established: {institute?.establishedYear}</p>
            </div>
        </div>
    );
};

export default InstituteCard;