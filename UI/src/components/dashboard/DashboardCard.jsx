import React from 'react';

const DashboardCard = ({ name, number }) => {
    return (
        <div className="w-full mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-center items-center gap-2">
            <h5 className="text-2xl font-medium tracking-tight text-gray-900">{name}</h5>
            <p className="text-2xl text-gray-700">{number}</p>
        </div>
    );
};

export default DashboardCard;