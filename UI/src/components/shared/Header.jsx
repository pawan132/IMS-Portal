import React, { useState } from 'react'
import logo from '../../assets/logo/msl-logo.png'
import { Link, NavLink } from 'react-router-dom'
import { FaBars } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const NavLinks = () => {
  return (
    <>
      <NavLink to='/'>Home</NavLink>
      <NavLink to='/technologies'>Technologies</NavLink>
      {/* <NavLink to='/resources'>Resources</NavLink> */}
      <NavLink to='/career'>Career</NavLink>
      <NavLink to='/blog'>Blog</NavLink>   
      <NavLink to='/contact'>Contact Us</NavLink>
    </>
  );
}

const Header = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }
  
  const style = { color: "white", fontSize: "1.5em" }

  return (
    <nav className='w-full bg-[#303849] shadow-sm'>
      <div className='min-h-[60px] w-11/12 flex justify-between items-center py-4 mx-auto'>
        <Link to='/'>
          <img src={logo} alt="logo" loading='lazy' width={140}/>
        </Link>
        <ul className='text-red-50 gap-6 text-lg hidden md:flex'>
          <NavLinks />
        </ul>
        <div className='md:hidden'>
          <button onClick={toggleMenu}>
            {
              isOpen ? <RxCross2 style={style}/> : <FaBars style={style}/> 
            }
          </button>
        </div>
        {
          isOpen ? (
            <div className='w-[100vw] h-full text-white z-50 flex justify-center absolute top-[60px] bg-black'>
              <div className='flex flex-col justify-start items-start gap-4'>
                <NavLinks />
              </div>
            </div>
          ) : null
        }
      </div>
    </nav>
  )
}

export default Header