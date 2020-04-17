import React, { useState } from "react";

// import logo from "../static/logo.svg";
import { Link } from "gatsby";

import "../css/global.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return(
    <nav className="font-mono bg-transparent">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button onClick={toggle} className="inline-flex items-center justify-center p-2 text-base transition duration-150 ease-in-out rounded-md hover:text-white hover:bg-green-700 focus:outline-none focus:bg-green-700 focus:text-white">
              <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path className={ isOpen ? 'hidden' : 'inline-flex' } strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                <path className={ isOpen ? 'inline-flex' : 'hidden' } strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="absolute inset-y-0 left-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
            <Link to="/" className="p-1 text-gray-400 transition duration-150 ease-in-out border-2 border-transparent rounded-full hover:text-white focus:outline-none focus:text-white ">
              {/* <img src={logo} alt="logo" className="w-10 h-10"/> */}
            </Link>
          </div>
          <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-end">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex">
                {/* <Link to="about" className="px-4 py-2 ml-4 text-sm text-base font-medium leading-5 transition duration-150 ease-in-out rounded-lg hover:text-white hover:bg-green-700 focus:outline-none focus:text-white focus:bg-green-700">About</Link>
                <Link to="blog" className="px-4 py-2 ml-4 text-sm text-base font-medium leading-5 transition duration-150 ease-in-out rounded-lg hover:text-white hover:bg-green-700 focus:outline-none focus:text-white focus:bg-green-700">Blog</Link>
                <Link to="register" className="px-4 py-2 ml-4 text-sm text-base font-medium leading-5 transition duration-150 ease-in-out rounded-lg hover:text-white hover:bg-green-700 focus:outline-none focus:text-white focus:bg-green-700">Register</Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={ isOpen ? 'block' : 'hidden' }>
        <div className="px-2 pt-2 pb-3">
          {/* <Link to="about" className="block px-4 py-2 mt-1 text-base font-medium text-gray-300 transition duration-150 ease-in-out rounded-lg hover:text-white hover:bg-green-700 focus:outline-none focus:text-white focus:bg-green-700">About</Link>
          <Link to="blog" className="block px-4 py-2 mt-1 text-base font-medium text-gray-300 transition duration-150 ease-in-out rounded-lg hover:text-white hover:bg-green-700 focus:outline-none focus:text-white focus:bg-green-700">Blog</Link>
          <Link to="register" className="block px-4 py-2 mt-1 text-base font-medium text-gray-300 transition duration-150 ease-in-out rounded-lg hover:text-white hover:bg-grgreenay-700 focus:outline-none focus:text-white focus:bg-green-700">Register</Link> */}
        </div>
      </div>
    </nav>
  )
};

export default Navbar;
