import {
  HiOutlineViewGrid,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
} from "react-icons/hi";

import { IoMdHome } from "react-icons/io";
import { PiStudentBold } from "react-icons/pi";
import { FaCodeBranch } from "react-icons/fa6";
import { FaDiscourse } from "react-icons/fa";
import { MdOutlineViewModule } from "react-icons/md";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icons: <IoMdHome />,
  },
  {
    key: "Student Register",
    label: "Student Register",
    path: "/admin/registerStudent",
    icons: <PiStudentBold />,
  },
  {
    key: "admission",
    label: "Admission",
    path: "/admin/admission",
    icons: <PiStudentBold />,
  },
  {
    key: "course",
    label: "Course",
    path: "/admin/courses",
    icons: <FaDiscourse />,
  },
  {
    key: "module",
    label: "Department",
    path: "/admin/course-module",
    icons: <MdOutlineViewModule />,
  },
  {
    key: "faculty",
    label: "Faculty",
    path: "/admin/faculty",
    icons: <HiOutlineViewGrid />,
  },
  {
    key: "batch",
    label: "Batch",
    path: "/admin/batch",
    icons: <HiOutlineViewGrid />,
  },
  {
    key: "attendance",
    label: "Attendance",
    path: "/admin/attendance",
    icons: <HiOutlineViewGrid />,
  },
  {
    key: "Faculty Schedule",
    label: "Faculty Schedule",
    path: "/admin/faculty/schedule",
    icons: <HiOutlineViewGrid />,
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: "admin",
    label: "Admin",
    path: "/admin-dashboard",
    icons: <HiOutlineCog />,
  },
  {
    key: "settings",
    label: "Settings",
    path: "/setting",
    icons: <HiOutlineQuestionMarkCircle />,
  },
];

export const DASHBOARD_SETTING_LINKS = [
  {
    key: "institute",
    label: "Institute",
    path: "/admin/institute",
    icons: <HiOutlineQuestionMarkCircle />,
  },
  {
    key: "branch",
    label: "Branch",
    path: "/admin/branches",
    icons: <FaCodeBranch />,
  },
  {
    key: "user",
    label: "User",
    path: "/admin/user",
    icons: <HiOutlineViewGrid />,
  },
  {
    key: "admin-module",
    label: "Module",
    path: "/admin/admin-course-module",
    icons: <HiOutlineCog />,
  },
  {
    key: "admin-course",
    label: "Course",
    path: "/admin/admin-course",
    icons: <HiOutlineCog />,
  },
  
];
