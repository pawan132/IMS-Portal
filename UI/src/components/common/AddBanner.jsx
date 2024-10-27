import React from 'react'

const AddBanner = ({ title, clickHandler }) => {
    return (
        <div className="flex justify-between text-center p-3 w-full">
            <h1 className="uppercase text-xl">{title}</h1>
            <button onClick={clickHandler} className="py-1 px-4 text-xl rounded-md bg-primary text-white/80 uppercase cursor-pointer">
                +
            </button>
        </div>
    )
}

export default AddBanner