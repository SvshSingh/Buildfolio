import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { styles } from '../styles';
import { navLinks } from '../constants';
import { logo, menu, close } from '../assets';
import { useLocation, useNavigate } from 'react-router-dom';

import { FiLogOut } from "react-icons/fi";
import { logout } from '../firebase/config';

const Navbar = ({isExpanded, handleBackPreview}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const[active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const [name, setName ] = useState("Gourav")


  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}
      style = {{background: "transparent"}}
    >
    {location.pathname == "/Create"|| isExpanded ? <button className='mr-6 rounded-md p-2 bg-violet-400' onClick={handleBackPreview}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
    </button> : ""}

      <div className='w-full flex justify-between items-center max-w-7x1 mx-auto'>
      <Link 
        to="/"
        className="flex items-center gap-2"
        onClick={() => {
          setActive("");
          window.scrollTo(0, 0);
        }}
        >
          <img src={logo} alt='logo' className="w-9 h-9 object-contain" />
          <p className='text-white text-[18px] font-bold cursor-pointer flex'>{name}</p>
        </Link>
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`${
                active === link.title
                ? "text-white"
                : "text-secondary"
              }
              hover : text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(link.title)}
            >
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}

        </ul>
        <div className='sm:hidden flex flex-1 justify-end items-center'>
            <img
              src={toggle ? menu : close}
              alt='menu'
              className="w-[28px] h-[28px] object-contain cursor-pointer"
              onClick={() => setToggle(!toggle)}
              />

              <div className={`${toggle ? 'hidden' : 'flex'} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
                <ul className="list-none flex justify-end items-start flex-col gap-4">
                  {navLinks.map((link) => (
                    <li
                      key={link.id}
                      className={`${
                        active === link.title
                        ? "text-white"
                        : "text-secondary"
                      }
                      font-poppins font-medium cursor-pointer text-[16px]`}
                      onClick={() => {
                        setToggle(!toggle);
                        setActive(link.title);
                        }}
                    >
                      <a href={`#${link.id}`}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar