import React from 'react'
// import { BiArrowToTop } from 'react-icons/bi'
import { FaLongArrowAltUp } from "react-icons/fa";


const PageTop = () => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div>
            <div className="flex justify-center items-center rounded-full h-10 w-10 bg-primary cursor-pointer text-white fixed right-4 bottom-4 hover:scale-110 transition-all duration-200 back-to-top" onClick={scrollToTop}>
                <FaLongArrowAltUp className='text-xl font-semibold' />
            </div>
        </div>
    )
}

export default PageTop