import React from "react";
import down from "../../assets/down.svg";
import add from "../../assets/add.svg";

const TeamSection = ({ title = "Team", teams = [1, 2, 3, 4] }) => {
  return (
    <div className="mt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between text-white bg-[#200539] py-2">
        <div className="flex items-center gap-2">
          <img src={down} alt="down arrow" className="mt-2.5 w-6" />
          <h3 className="text-xl">{title}</h3>
        </div>
        <img src={add} alt="add icon" />
      </div>

      {/* Team List */}
      {teams.map((team, index) => (
        <div
          key={index}
          className="flex items-center justify-between text-white bg-[#200539]"
        >
          <div className="flex items-center gap-2 pl-6">
            <p className="text-[26px] text-[#BCBCBC]">#</p>
            <h3 className="text-[#BCBCBC] text-xl">Team{team}</h3>
          </div>
          <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
            3
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamSection;
