import React from "react";
import user from "../../assets/icon.svg";
import msg from "../../assets/msg.svg";
import call from "../../assets/call.svg";
import video from "../../assets/Video.svg";
const Header = ({ title = "Chat" }) => {
  return (
    <header className="bg-[#200539] border-b border-[#BCBCBC] p-4 flex justify-between items-center">
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <div className="flex gap-2 ">
        <img
                  src={user}
                  alt=""
                  className="border -2 border-[#9982B4] px-3 py-2 rounded-xl"
                />
                <img
                  src={msg}
                  alt=""
                  className="border -2 border-[#9982B4] px-2 py-2 rounded-xl"
                />
                <img
                  src={call}
                  alt=""
                  className="border -2 border-[#9982B4] px-2 py-2 rounded-xl"
                />
                <img
                  src={video}
                  alt=""
                  className="border -2 border-[#9982B4] px-2 py-2 rounded-xl"
                />
              </div>
            </header>
  );
}
export default Header;