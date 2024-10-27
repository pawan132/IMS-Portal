import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/images/ims-logo.jpg'
import email_verified from '../assets/images/email-verified.jpg'
import email_failed from '../assets/images/failed.avif'

const EmailVerified = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const success = searchParams.get('success');
    const message = searchParams.get('message');

    return (
        <div className='h-screen w-screen flex justify-center items-center bg-[#f3f3f3]'>
            {
                success === 'true' ? (
                    <div className="max-w-[600px] mx-auto bg-[#ffffff] shadow-[0 0 10px rgba(0, 0, 0, 0.1)] overflow-hidden rounded-lg">
                        <div class="p-6 flex flex-col justify-between items-center gap-5">
                            <img src={logo} alt="Logo" className='max-w-[100px]' />
                            <h1 className='text-[24px]'>Account Activated</h1>
                            <img
                                src={email_verified}
                                alt="Email Icon"
                                className="max-w-[200px]"
                            />
                            <p className='text-[16px] text-[#666666] text-center'>
                                Thank you, your email has been verified. Your account is now active.
                                Please use the link below to login to your account.
                            </p>
                            <Link to={"/"} className='inline-block py-[10px] px-[20px] text-[16px] text-white bg-[#e4880f] rounded-md'>LOGIN TO YOUR ACCOUNT</Link>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-[600px] mx-auto bg-[#ffffff] shadow-[0 0 10px rgba(0, 0, 0, 0.1)] overflow-hidden rounded-lg">
                        <div class="p-6 flex flex-col justify-between items-center gap-5">
                            <img src={logo} alt="Logo" className='max-w-[100px]' />
                            <h1 className='text-[24px]'>Verification Failed</h1>
                            <img
                                src={email_failed}
                                alt="Email Icon"
                                className="max-w-[200px]"
                            />
                            <p className='text-[16px] text-[#666666] text-center'>
                                Sorry, your email is not verified.
                                ${message}
                            </p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default EmailVerified