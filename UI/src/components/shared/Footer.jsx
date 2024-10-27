import React from "react";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/logo/ims-logo.jpg";

// Icons
import {
  FaFacebookF,
  FaGooglePlusSquare,
  FaYoutubeSquare,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const BottomFooter = [
  { name: "Privacy Policy", link: '/privacy-and-policy' },
  { name: "Terms & Conditions", link: '/terms-and-conditions' }
];
const Resources = ["Blogs", "Gallery"];

const Technology = [
  "Robotic Process Automation",
  "Cyber Security",
  "Data Analytics",
  "Application Development",
  "Cloud Computing",
  "System Integration",
];

const getInTouch = [
  {
    icon: <FaMapMarkerAlt />,
    text: "Mittal Software Labs Ltd.",
    subText:
      "B1/E13, Block E, Mohan Cooperative Industrial Estate, Badarpur, New Delhi, Delhi, India - 110044",
  },
  {
    icon: <FaPhoneAlt />,
    text: "+91 11 4475 6172",
    subText: "",
  },
  {
    icon: <IoIosMail />,
    text: "info@mittalsoftwarelabs.com",
    subText: "",
  },
];

const socialLinks = [
  {
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/company/mittal-software-labs/",
  },
  {
    icon: <FaFacebookF />,
    link: "https://www.facebook.com/Mittalsoftwarelabsltd",
  },
  {
    icon: <FaXTwitter />,
    link: "https://x.com/MSL_LLP/status/1786341356660539531",
  },
  {
    icon: <FaYoutubeSquare />,
    link: "https://www.youtube.com/@mittalsoftwarelabsltd",
  },
];

const Footer = () => {
  return (
    <div className="bg-[#18191a] text-white">
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-1 border-richblack-700">
          <div className="w-full flex justify-between flex-wrap">
            <div className="w-full lg:w-[17vw] flex flex-col gap-8 mb-7">
              <img src={Logo} alt="" width={250} className="object-contain" />

              <div className="flex gap-3 text-2xl">
                {socialLinks.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : "_self"}
                    rel={
                      item.link.startsWith("http") ? "noopener noreferrer" : ""
                    }
                    className="text-current hover:text-richblack-50 transition-all duration-200"
                  >
                    {item.icon}
                    {item.text && <span className="ml-2">{item.text}</span>}
                  </a>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[10vw] flex flex-col gap-3 mb-7">
              <div className="flex flex-col gap-3">
                <h1 className="text-richblack-50 font-semibold text-[16px]">
                  Company
                </h1>
                <div className="flex flex-col gap-2 mb-4">
                  {["About", "Career"].map((ele, i) => {
                    return (
                      <div
                        key={i}
                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                      >
                        <Link to={ele.toLowerCase()}>{ele}</Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[10vw] flex flex-col gap-3 mb-7">
              <div className="flex flex-col gap-3">
                <h1 className="text-richblack-50 font-semibold text-[16px]">
                  Resources
                </h1>
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to={"/blogs"}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    {Resources[0]}
                  </Link>
                  <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                    {Resources[1]}
                  </div>
                </div>

                {/* <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                  Support
                </h1>
                <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                  <Link to={"/help-center"}>Help Center</Link>
                </div> */}
              </div>
            </div>

            <div className="w-full lg:w-[15vw] flex flex-col gap-3 mb-7">
              <div className="flex flex-col gap-3">
                <h1 className="text-richblack-50 font-semibold text-[16px]">
                  Technologies
                </h1>

                <div className="flex flex-col gap-2 mt-2">
                  {Technology.map((tech, index) => {
                    const path = `technology/${tech
                      .split(" ")
                      .join("-")
                      .toLowerCase()}`;
                    return (
                      <Link
                        key={index}
                        to={path}
                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                      >
                        {tech}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[27vw] flex flex-col gap-2 mb-7">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Get In Touch
              </h1>

              <div className="flex flex-col gap-1 mt-2">
                <div className="flex gap-x-2">
                  <FaMapMarkerAlt className="text-2xl" />
                  <div>
                    <p>Registered Address</p>
                    <p>
                      First Floor, FB/B1 Extension, Mathura Road, Mohan Cooperative
                      Industrial Estate, New Delhi, Delhi, India - 110044
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Office+Pass,+Block+E,+Mohan+Cooperative+Industrial+Estate,+Badarpur,+New+Delhi,+Delhi,+India+-+110044"
                  className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex gap-x-2">
                    <FaMapMarkerAlt className="text-2xl" />
                    <div>
                      <p>Corporate Address</p>
                      <p>
                        B1/E13, Block E, Mohan Cooperative Industrial Estate,
                        Badarpur, New Delhi, Delhi, India - 110044
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="tel:+911144756172"
                  className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                >
                  <div className="flex gap-x-2 items-center">
                    <FaPhoneAlt />
                    <div>
                      <p>+91 11 4475 6172</p>
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:info@mittalsoftwarelabs.com"
                  className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                >
                  <div className="flex gap-x-2 items-center">
                    <IoIosMail className="text-xl" />
                    <div>
                      <p>info@mittalsoftwarelabs.com</p>
                    </div>
                  </div>
                </a>

                {/* {
                  getInTouch.map((data) => {
                    return (
                      <Link to={''} className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                        <div className="flex gap-x-2 items-start">
                          {data.icon}
                          <div className="flex flex-col items-start justify-center">
                            <p>{data.text}</p>
                            <p>{data.subText}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })
                } */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm">
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className="flex flex-row">
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={` ${BottomFooter.length - 1 === i
                    ? ""
                    : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    } px-3 `}
                >
                  <Link to={ele.link}>
                    {ele.name}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            © 2024 Mittal Software Labs. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;