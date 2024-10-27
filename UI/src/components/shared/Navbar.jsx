import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo/msl-logo.png'
import { Link, NavLink } from 'react-router-dom'
import { FaBars } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

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

    //   const style = { color: "white", fontSize: "1.5em" }


    const navItems = [
        { link: "Home", path: "/" },
        { link: "Technologies", path: "technologies" },
        { link: "Resources", path: "resources" },
        { link: "Career", path: "career" },
        { link: "Blog", path: "blogs" },
        { link: "Contact Us", path: "contact" },
    ];

    return (
        <header className='w-full bg-[#303849] md:bg-transparent fixed top-0 left-0 right-0'>
            <nav className={`py-4 lg:px-14 px-4 ${isSticky ? 'sticky top-0 left-0 right-0 borber bg-[#303849] duration-300' : ''}`}>
                <div className='flex justify-between items-center gap-8 text-white'>
                    <Link to='/'>
                        <img src={logo} alt="logo" loading='lazy' width={140} />
                    </Link>

                    {/* nav items for large devices */}
                    <ul className='space-x-12 text-md hidden md:flex'>
                        {
                            navItems.map(({ link, path }) => <Link to={path} key={path} className='block first:font-medium'>{link}</Link>)
                        }
                    </ul>

                    {/* menu btn for only mobile devices */}
                    <div className='md:hidden'>
                        <button onClick={toggleMenu} className='focus:outline-none focus:text-gray-500'>
                            {
                                isOpen ? <RxCross2 className='h-6 w-6' /> : <FaBars className='h-6 w-6' />
                            }
                        </button>
                    </div>
                </div>

                {/* nav items for mobile devices */}
                <div className={`space-y-4 px-4 mt-16 py-7 ${isOpen ? 'block fixed top-0 right-0 left-0' : 'hidden'}`}>
                    {
                        navItems.map(({ link, path }) => <Link to={path} key={path} className='block first:font-medium'>{link}</Link>)
                    }
                </div>
            </nav>
        </header>
    )
}

export default Navbar