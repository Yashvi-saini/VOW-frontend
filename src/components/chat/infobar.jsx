import React from "react";
import guser from "../../assets/guser.svg";
import pin from "../../assets/pin.svg";
import search from "../../assets/search.svg";
import cross from "../../assets/cross.svg";
const InfoBar = () => {
    return (
        <div className=" relative flex-1 overflow-y-auto space-y-4">
                  <div className=" sticky top-0 flex bg-gray-200 justify-between p-3 z-1">
                    <div className="flex items-center">
                      <p className=" text-[26px] mr-2 ">#</p>
                      <p className=" text-2xl pt-0.5">Team 1</p>
                    </div>
                    <div className="flex items-center gap-3 text-xl">
                      <img src={guser} alt="" />
                      <p>10 members</p>
                      <p>8 online</p>
                    </div>
                    <div className="flex gap-7 mr-3 ">
                      <img src={pin} alt="" className="w-4" />
                      <img src={search} alt="" className="w-4" />
                      <img src={cross} alt="" className="w-3" />
                    </div>
                  </div>
                </div>
    );
}
export default InfoBar; 