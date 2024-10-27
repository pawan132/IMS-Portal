import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../services/operations/authAPI'
import toast from 'react-hot-toast'
import logo from '../assets/logo/ims-logo.jpg'

const ResetPassword = () => {
    const [checkbox, setCheckbox] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState({});

    const { token } = useParams();

    // const [showPassword, setShowPassword] = useState(false);

    const { password, confirmPassword } = formData

    const handleOnChange = (e) => {
        // console.log(`${[e.target.name]}: ${e.target.value}`)
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const validateForm = () => {
        const errors = {};

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
        if (!checkbox) {
            toast.error("Please check the checkbox to proceed");
        }
        else {
            if (validateForm()) {
                if (formData.password === formData.confirmPassword) {
                    dispatch(resetPassword(password, confirmPassword, token, navigate))
                } else {
                    toast.error('Password not match')
                }
            } else {
                console.error('validation error');
            }
        }
    }

    return (
        <div>
            <section className="bg-gray-50 ">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="flex items-center mb-6 text-4xl font-semibold text-gray-900 ">
                        <img className="w-24 h-10 mr-2" src={logo} alt="logo" />
                    </div>
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Reset your password
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="post" onSubmit={handleOnSubmit}>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">New Password*</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 " onChange={handleOnChange} />
                                    {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 ">Confirm New password*</label>
                                    <input type="password" name="confirmPassword" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 " onChange={handleOnChange} />
                                    {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword}</span>}
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary" required="" onClick={() => { setCheckbox(!checkbox) }} />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <span className="font-medium text-primary hover:underline ">Terms and Conditions</span></label>
                                    </div>
                                </div>
                                <button type="submit" className={`w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${!checkbox ? 'bg-gray-500 hover:bg-gray-500 focus:ring-gray-700' : 'bg-primary hover:bg-primary focus:ring-primary'}`} disabled={!checkbox}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ResetPassword