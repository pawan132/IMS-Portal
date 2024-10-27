import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/operations/authAPI'
import { getBrowserInfo, getIpAddress } from '../utils/browserDetails'
import toast from 'react-hot-toast'

const Signup = () => {
    const [checkbox, setCheckbox] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: ""
    })

    // const [showPassword, setShowPassword] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }


    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!formData.mobile.trim()) {
            errors.mobile = 'Mobile no is required';
        } else if (formData.mobile.length !== 10) {
            errors.mobile = 'Mobile no should be 10 digits';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        }
        if (!formData.confirmPassword.trim()) {
            errors.confirmPassword = 'Confirm Password is required';
        }

        setErrors(errors);
        console.error(errors);
        console.error(Object.keys(errors).length === 0);
        return Object.keys(errors).length === 0;
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault()

        const ipAddress = await getIpAddress();
        const browserInfo = getBrowserInfo();

        // console.log({
        //     ipAddress,
        //     browserInfo,
        // });

        if (validateForm()) {
            if (formData.password === formData.confirmPassword) {
                dispatch(register(formData, ipAddress, browserInfo, navigate))
                setFormData({
                    name: "",
                    email: "",
                    mobile: "",
                    password: "",
                    confirmPassword: ""
                })
            } else {
                toast.error('Password not matched')
            }
        } else {
            console.error('validation error');
        }
    }

    return (
        <section className="bg-gray-50 h-screen flex justify-center items-center overflow-auto">
            <div className="w-5/12 bg-white rounded-lg shadow-md md:mt-0 xl:p-0 overflow-y-scroll">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                        Create an account
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="post" onSubmit={handleOnSubmit}>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Full Name*</label>
                            <input type="name" name="name" id="name" maxLength={30} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 " placeholder="enter your name here" onChange={handleOnChange} />
                            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email*</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 " placeholder="name@company.com" onChange={handleOnChange} />
                                {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                            </div>
                            <div>
                                <label htmlFor="mobile" className="block mb-2 text-sm font-medium text-gray-900 ">Mobile*</label>
                                <input type="number" name="mobile" id="mobile" minLength={10} maxLength={10} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 " placeholder="1234567890" onChange={handleOnChange} />
                                {errors.mobile && <span className="text-sm text-red-500">{errors.mobile}</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password*</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 " onChange={handleOnChange} />
                                {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 ">Confirm password*</label>
                                <input type="password" name="confirmPassword" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 " onChange={handleOnChange} />
                                {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword}</span>}
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary" required="" onClick={() => { setCheckbox(!checkbox) }} />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <span className="font-medium text-primary hover:underline ">Terms and Conditions</span></label>
                            </div>
                        </div>
                        <button type="submit" className={`w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${!checkbox ? 'bg-gray-500 hover:bg-gray-500 focus:ring-gray-700' : 'bg-primary hover:bg-primary focus:ring-primary'}`} disabled={!checkbox}>Create an account</button>
                        <p className="text-sm font-light text-gray-500 ">
                            Already have an account? <Link to={'/'} className="font-medium text-primary hover:underline">Login here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Signup