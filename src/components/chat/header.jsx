import React from "react";
import user from "../../assets/icon.svg";
import msg from "../../assets/msg.svg";
import call from "../../assets/call.svg";
import video from "../../assets/Video.svg";

const Header = ({ title = "Chat", onCallClick }) => {
  return (
    <header className="bg-[#200539] border-b border-[#BCBCBC] p-3 flex justify-between items-center">
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      
    </header>
  );
};

export default Header;