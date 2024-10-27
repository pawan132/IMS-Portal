import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo/ims-logo.jpg'
import { Link, matchPath, useLocation } from "react-router-dom"
import { FaBars } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { NavbarLinks, TechnologySubLinks } from "../../data/navbar-links"
import { BiSolidChevronDown } from 'react-icons/bi';

const Navbar2 = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [techDropdownOpen, setTechDropdownOpen] = useState(false);
    const location = useLocation();

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const closeMenu = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsSticky(true);
            }
            else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.addEventListener('scroll', handleScroll);
        }
    });

    // bg-[#303849]

    return (
        <header className='w-full bg-[#18191a]'>
            <nav className='py-4 lg:px-14 px-4'>
                <div className="flex justify-between items-center gap-8 text-white">
                    {/* Logo */}
                    <Link to="/">
                        <img src={logo} alt="Logo" width={140} loading="lazy" />
                    </Link>
                    {/* Navigation links */}

                    {/* desktop view */}
                    <nav className="hidden md:block">
                        <ul className="flex gap-x-6 text-white">
                            {NavbarLinks.map((link, index) => (
                                <li key={index}>
                                    {link.title === "Technology" ? (
                                        <>
                                            <div
                                                className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/technology/:technologyName")
                                                    ? "text-primary"
                                                    : "text-white"
                                                    }`}
                                            >
                                                <p>{link.title}</p>
                                                <BiSolidChevronDown />
                                                <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-black p-4 text-white opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                    <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-black"></div>
                                                    {
                                                        TechnologySubLinks
                                                            .map((subLink, i) => (
                                                                <Link
                                                                    to={`/technology/${subLink.path
                                                                        .toLowerCase()}`}
                                                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-white/5"
                                                                    key={i}
                                                                >
                                                                    <p>{subLink.title}</p>
                                                                </Link>
                                                            )
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <Link to={link.path}>
                                            <p
                                                className={`${matchRoute(link?.path)
                                                    ? "text-primary"
                                                    : "text-white"
                                                    }`}
                                            >
                                                {link.title}
                                            </p>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* mobile view */}
                    <div className='md:hidden'>
                        <button onClick={toggleMenu} className='focus:outline-none focus:text-gray-500 cursor-pointer z-[1000]'>
                            <FaBars className='h-6 w-6 text-white' />
                        </button>
                    </div>

                    {
                        isOpen && (
                            <div className={`navbar-fixed fixed h-full w-screen md:hidden bg-black/50 backdrop-blur-sm top-0 right-0 z-[50] transition-all duration-200 ${isOpen ? 'navbar-visible' : 'navbar-hidden'}`}>
                                <section className={`text-black bg-white flex flex-col absolute right-0 top-0 h-screen p-9 gap-8 transition-all duration-200 ${isOpen ? 'navbar-visible' : 'navbar-hidden'}`}>
                                    <RxCross2 onClick={toggleMenu} className='mt-0 mb-8 text-3xl cursor-pointer' />

                                    <ul className="flex flex-col gap-y-6 text-black font-bold">
                                        {NavbarLinks.map((link, index) => (
                                            <li key={index} className='cursor-pointer'>
                                                {link.title === "Technology" ? (
                                                    <>
                                                        <div
                                                            onClick={() => setTechDropdownOpen(!techDropdownOpen)}
                                                            className={`group relative flex flex-col cursor-pointer gap-1 ${matchRoute("/technology/:technologyName")
                                                                ? "text-primary"
                                                                : "text-black"
                                                                }`}
                                                        >
                                                            <div className='flex items-center gap-2'>
                                                                <p>{link.title}</p>
                                                                <BiSolidChevronDown />
                                                            </div>
                                                            {
                                                                techDropdownOpen && (
                                                                    <div className='flex flex-col'>
                                                                        {
                                                                            TechnologySubLinks
                                                                                .map((subLink, i) => (
                                                                                    <Link
                                                                                        to={`/technology/${subLink.path
                                                                                            .toLowerCase()}`}
                                                                                        className="rounded-lg bg-transparent py-4 pl-4 hover:bg-white/5"
                                                                                        key={i}
                                                                                        onClick={closeMenu}
                                                                                    >
                                                                                        <p>{subLink.title}</p>
                                                                                    </Link>
                                                                                )
                                                                                )
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Link to={link.path} onClick={closeMenu}>
                                                        <p
                                                        className={`${matchRoute(link?.path)
                                                            ? "text-primary"
                                                            : "text-black"
                                                            }`}
                                                        >
                                                            {link.title}
                                                        </p>
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        )
                    }
                </div>
            </nav>
        </header>
    )
}

export default Navbar2