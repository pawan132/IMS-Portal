import React from 'react'
import { HiOutlineBell, HiOutlineChatAlt, HiOutlineSearch } from 'react-icons/hi'
import ProfileDropdown from '../adminHeader/ProfileDropdown'
import DropdownUser from '../layout/DropdownUser'
import DropdownNotification from '../layout/DropdownNotification'

export default function AdminHeader() {
  return (
    <div className='sticky top-0 z-[9999] flex w-full bg-white drop-shadow-1 border-b-2'>
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className='relative'>
          <HiOutlineSearch fontSize={20} className='absolute top-1/2 -translate-y-1/2 left-3' />
          <input
            type="text"
            placeholder='Search...'
            className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-black rounded-md pl-11 pr-4'
          />
        </div>
        <div className='flex items-center gap-4 mt-2'>
          <HiOutlineChatAlt fontSize={28} className='cursor-pointer' />
          <HiOutlineBell fontSize={28} className='cursor-pointer' />
          <DropdownUser />
        </div>
      </div>
    </div>
  )
}