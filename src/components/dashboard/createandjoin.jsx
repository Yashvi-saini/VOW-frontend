import React from "react";
import keyIcon from "../../assets/Key.svg";

const CreateAndJoin = ({ onCreate }) => {
  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-2 
        gap-6 
        my-4 sm:my-6 md:my-8 
        w-full
      "
    >
      {/* Create Workspace Card */}
      <div
        className="
          gradient rounded-xl p-4 sm:p-6 
          border-none flex flex-col 
          items-center justify-center text-center gap-4 
          min-h-[160px] sm:min-h-[185px] 
          shadow-sm
        "
      >
        <div>
          <h3
            className="
              font-bold mb-2 
              text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] 
              text-black
            "
          >
            Create Workspace
          </h3>
        </div>
        <button
          onClick={onCreate}
          className="
            bg-[#5E9BFF] text-white 
            px-5 sm:px-6 py-2 
            rounded-lg 
            hover:bg-[#4A8CE0] 
            transition 
            font-medium sm:font-normal 
            text-[16px] sm:text-[18px] md:text-[20px] 
            border border-[#1F2937] 
            w-24 sm:w-28 h-10 sm:h-11
          "
        >
          Create
        </button>
      </div>

      {/* Join Workspace Card */}
      <div
        className="
          gradient rounded-xl p-4 sm:p-6 
          border-none flex flex-col 
          items-center justify-center text-center gap-4 
          min-h-[160px] sm:min-h-[185px] 
          shadow-sm
        "
      >
        <div className="w-full max-w-xs sm:max-w-sm">
          <h3
            className="
              font-bold mb-3 
              text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] 
              text-black text-center
            "
          >
            Join New Workspace
          </h3>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter Workspace ID to join"
              className="
                border bg-[#FFFFFF] border-[#707070] 
                rounded-lg 
                pl-3 pr-10 py-2 
                w-full 
                text-[13px] sm:text-sm md:text-[15px] 
                focus:outline-none focus:border-[#5E9BFF] 
                text-[#0E1219] placeholder:text-[#707070]
              "
            />
            <img
              src={keyIcon}
              alt="key"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60"
            />
          </div>
        </div>
        <button
          className="
            bg-[#5E9BFF] text-white 
            px-5 sm:px-6 py-2 
            rounded-lg 
            hover:bg-[#4A8CE0] 
            transition 
            font-medium sm:font-normal 
            text-[16px] sm:text-[18px] md:text-[20px] 
            border border-[#1F2937] 
            w-24 sm:w-28 h-10 sm:h-11
          "
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default CreateAndJoin;
