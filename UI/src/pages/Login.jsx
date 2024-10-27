import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, verifyEmail } from '../services/operations/authAPI';
import logo from '../assets/logo/ims-logo.jpg';

const Login = () => {
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        emailOrMobile: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [error401, setError401] = useState(false); // State to manage 401 error

    const { emailOrMobile, password } = formData;

    useEffect(() => {
        // Auto-fill form with saved credentials if "Remember Me" was checked
        const savedEmailOrMobile = localStorage.getItem('rememberMeEmailOrMobile');
        const savedPassword = localStorage.getItem('rememberMePassword');
        if (savedEmailOrMobile && savedPassword) {
            setFormData({ emailOrMobile: savedEmailOrMobile, password: savedPassword });
            setRememberMe(true);
        }
    }, []);

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.emailOrMobile.trim()) {
            errors.emailOrMobile = 'Email or mobile number is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.emailOrMobile) && !/^\d{10}$/.test(formData.emailOrMobile)) {
            errors.emailOrMobile = 'Email or mobile number is invalid';
        }
        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        }

        setErrors(errors);
        console.error(errors);
        console.error(Object.keys(errors).length === 0);
        return Object.keys(errors).length === 0;
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            if (validateForm()) {
                await dispatch(login(emailOrMobile, password, rememberMe, navigate));
                setError401(false); // Reset 401 error state on successful login
            } else {
                console.error('validation error');
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                setError401(true);
            } else {
                console.error(error);
            }
        }
    };

    return (
        <>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-50">
                    <div className="flex items-center mb-6 text-4xl font-semibold text-gray-900 ">
                        <img className="w-24 h-10 mr-2" src={logo} alt="logo" />
                        Admin
                    </div>
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6 " action="post" onSubmit={handleOnSubmit}>
                                <div>
                                    <label htmlFor="emailOrMobile" className="block mb-2 text-sm font-medium text-gray-900">Email or Mobile*</label>
                                    <input type="text" name="emailOrMobile" id="emailOrMobile" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" placeholder="name@company.com or 1234567890" value={emailOrMobile} onChange={handleOnChange} />
                                    {errors.emailOrMobile && <span className="text-sm text-red-500">{errors.emailOrMobile}</span>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password*</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" value={password} onChange={handleOnChange} />
                                    {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
                                </div>
                                {error401 && (
                                    <p className="text-sm text-red-500">
                                        Email not verified. <button onClick={() => dispatch(verifyEmail(emailOrMobile, navigate))} className="font-medium text-primary hover:underline">click here to resend verification email</button>
                                    </p>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary" checked={rememberMe} onChange={handleRememberMeChange} />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500">Remember me</label>
                                        </div>
                                    </div>
                                    <Link to={'/forgot-password'} className="text-sm font-medium text-primary hover:underline cursor-pointer">Forgot password?</Link>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>

                                <p className="text-sm font-light text-gray-500">
                                    Don’t have an account yet? <Link to={'/register'} className="font-medium text-primary hover:underline cursor-pointer">Sign up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
