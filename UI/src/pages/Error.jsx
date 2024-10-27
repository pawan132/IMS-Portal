// import CTAButton from "../components/common/CTAButton";

function Error() {
    return (
        <>
            <div className='h-[90vh] w-full flex justify-center items-center flex-col'>
                <p className='text-[4.5rem] font-extrabold text-[#152440]'>404</p>
                <p className='text-[2rem] font-bold text-[#152440]'>Page Not Found</p>
                <p className='mb-[3%] text-[#6B6A75] text-[1rem]'>Sorry, the page you are looking for does not exist.</p>
                {/* <CTAButton linkto={'/'}>Go Back to HomePage</CTAButton> */}
            </div>
        </>
    );
}

export default Error;