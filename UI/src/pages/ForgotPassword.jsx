import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword, login } from '../services/operations/authAPI'
import logo from '../assets/logo/ims-logo.jpg'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [checkbox, setCheckbox] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        email: ""
    })
    const [errors, setErrors] = useState({});

    const { email } = formData

    const handleOnChange = (e) => {
        // console.log(`${[e.target.name]}: ${e.target.value}`)
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        setErrors(errors);
        console.error(errors);
        console.error(Object.keys(errors).length === 0);
        return Object.keys(errors).length === 0;
    };

    const handleOnSubmit = (e) => {
        e.preventDefault()
    
        if (validateForm()) {
            dispatch(forgotPassword(email, navigate));
            setFormData({
                email: ""
            })
        } else {
            console.error('validation error');
        }
    }

    return (
        <>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="flex items-center mb-6 text-4xl font-semibold text-gray-900 ">
                        <img className="w-24 h-10 mr-2" src={logo} alt="logo" />
                    </div>
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Forgot your password?
                            </h1>
                            <p className='text-base font-normal text-gray-500 dark:text-gray-400'>
                                Don't fret! Just type in your email and we will send you a code to reset your password!
                            </p>
                            <form className="space-y-4 md:space-y-6 " action="post" onSubmit={handleOnSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email*</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" placeholder="name@company.com" onChange={handleOnChange} />
                                    {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary" required="" onClick={() => { setCheckbox(!checkbox) }} />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <span className="font-medium text-primary hover:underline ">Terms and Conditions</span></label>
                                    </div>
                                </div>
                                <button type="submit" className={`w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${!checkbox ? 'bg-gray-500 hover:bg-gray-500 focus:ring-gray-700' : 'bg-primary hover:bg-primary focus:ring-primary'}`} disabled={!checkbox}>Reset password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ForgotPassword