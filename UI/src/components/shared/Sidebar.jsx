import React, { useState } from 'react';
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SETTING_LINKS } from '../../data/navigation';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { logout } from '../../services/operations/authAPI';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/logo/ims-logo.jpg';
import { VscSignOut } from 'react-icons/vsc';

const linkClass = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-black/10 hover:no-underline rounded-sm text-base';

const Sidebar = ({ setConfirmationModal }) => {
    const { user, loading: profileLoading } = useSelector((state) => state.profile);
    const { loading: authLoading } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (profileLoading || authLoading) {
        return (
            <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear lg:static lg:translate-x-0 border-r-2 px-6`}>
            <div className="flex p-2 rounded-md justify-center items-center">
                <img src={logo} alt="logo" width={150} />
            </div>
            <div className="flex-1 py-5 flex flex-col gap-1 no-scrollbar overflow-y-auto duration-300 ease-linear">
                {DASHBOARD_SIDEBAR_LINKS.map((item, index) => (
                    <SidebarLink key={index} item={item} />
                ))}
            </div>
            <div className="flex flex-col gap-1 pt-2 border-top border-primary">
                {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item, index) => (
                    item.key === 'admin' ? (
                        <li key={index}>
                            <button
                                type="button"
                                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                aria-controls="dropdown-example"
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            >
                                <span className="text-xl me-2">{item.icons}</span>
                                <span className="flex-1 text-left rtl:text-right whitespace-nowrap">{item.label}</span>
                                <svg
                                    className={`w-3 h-3 transform transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {isSettingsOpen && (
                                <ul id="dropdown-example" className="py-2 space-y-2">
                                    {
                                        DASHBOARD_SETTING_LINKS.map((item, index) => (
                                            <li>
                                                <Link to={item.path} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100">{item.label}</Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )}
                        </li>
                    ) : (
                        <SidebarLink key={index} item={item} />
                    )
                ))}
                <div
                    onClick={() =>
                        setConfirmationModal({
                            text1: "Are you sure?",
                            text2: "You will be logged out of your account.",
                            btn1Text: "Logout",
                            btn2Text: "Cancel",
                            btn1Handler: () => dispatch(logout(navigate)),
                            btn2Handler: () => setConfirmationModal(null),
                        })}
                    className={classNames('cursor-pointer text-red-400 hover:text-red-600', linkClass)}
                >
                    <div className="flex items-center gap-x-2">
                        <VscSignOut className="text-xl" />
                        <span>Logout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

function SidebarLink({ item }) {
    const { pathname } = useLocation();
    return (
        <Link to={item.path} className={classNames(pathname === item.path ? 'text-light bg-black/10 font-medium' : 'text-black', linkClass)}>
            <span className="text-xl me-2">{item.icons}</span>
            {item.label}
        </Link>
    );
}
