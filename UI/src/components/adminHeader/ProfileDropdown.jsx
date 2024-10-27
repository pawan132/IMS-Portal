import { useRef, useState } from "react"
import { FaUserCircle } from "react-icons/fa";
import { VscDashboard } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../hooks/useOnClickOutside"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

//   if (!user) return null

  return (
    <button className="relative" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-black overflow-hidden rounded-md border-[1px] border-black bg-white"
          ref={ref}
        >
          <Link to="dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm">
              <VscDashboard className="text-lg" />
              Profile
            </div>
          </Link>
        </div>
      )}
    </button>
  )
}
