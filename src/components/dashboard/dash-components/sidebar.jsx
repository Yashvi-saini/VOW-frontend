import React, { useState, useEffect, useRef } from 'react';
import buserIcon from '../dashboard-assets/bperson.svg';
import bsearchIcon from '../dashboard-assets/bsearch.svg';
import bbellIcon from '../dashboard-assets/bnotifications.svg';
import bcalendarIcon from '../dashboard-assets/btoday.svg';
import bteamIcon from '../dashboard-assets/bgmail_groups.svg';
import bplusIcon from '../dashboard-assets/badd_circle.svg';

import wuserIcon from '../dashboard-assets/person.svg';
import wsearchIcon from '../dashboard-assets/search.svg';
import wbellIcon from '../dashboard-assets/notifications.svg';
import wcalendarIcon from '../dashboard-assets/today.svg';
import wteamIcon from '../dashboard-assets/gmail_groups.svg';
import wplusIcon from '../dashboard-assets/add_circle.svg';

const iconPairs = [
  { default: buserIcon, active: wuserIcon },
  { default: bsearchIcon, active: wsearchIcon },
  { default: bbellIcon, active: wbellIcon },
  { default: bcalendarIcon, active: wcalendarIcon },
  { default: bteamIcon, active: wteamIcon },
  { default: bplusIcon, active: wplusIcon },
];

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setActiveIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={sidebarRef}
      className="fixed top-[55vh] left-0 -translate-y-1/2 h-[67vh] w-16 bg-white flex flex-col justify-between z-50 rounded-2xl border-2 border-[#BCBCBC]"
    >
      {iconPairs.map((icon, index) => (
        <button
          key={index}
          onClick={() => setActiveIndex(index)}
          className={`w-[62px] h-[62px] flex items-center justify-center cursor-pointer rounded-[14px] transition-all duration-200 ${
            activeIndex === index ? 'bg-[#5C0EA4]' : 'bg-transparent'
          }`}
        >
          <img
            src={activeIndex === index ? icon.active : icon.default}
            alt={`icon-${index}`}
            className="w-8 h-8"
          />
        </button>
      ))}
    </div>
  );
}