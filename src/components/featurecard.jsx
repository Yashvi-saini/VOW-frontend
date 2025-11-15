import React from "react";
import ss1 from "../assets/ss1.svg";
import ss2 from "../assets/ss2.svg";
import ss3 from "../assets/ss3.png";
import ss4 from "../assets/ss4.svg";

const features = [
  {
    title: "Custom Workspaces",
    description:
      "Create rooms, meeting halls, and collaboration zones designed for your team's workflow.",
  },
  {
    title: "Room Navigation",
    description:
      "Move freely between rooms just like in a physical office — stay connected and engaged.",
  },
  {
    title: "Real-Time Communication",
    description: "Connect via video, voice, and chat in one seamless experience.",
  },
  {
    title: "Analytics and Insights",
    description: "View engagement and activity metrices to guide smarter decisions.",
  },
];

const FeatureCards = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="w-full mx-auto">
        {/* Horizontal scroll container */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar py-4"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex-none w-[472px] h-[434px] bg-[#EBE2F6] p-2 pb-3 mr-[65px] rounded-xl"
            >
              <div className="w-full h-72 mb-4 rounded-md overflow-hidden flex items-center justify-center">
                {index === 0 ? (
                  <img 
                    src={ss1} 
                    alt="Custom Workspaces" 
                    className="w-full h-full object-cover"
                  />
                ) : index === 1 ? (
                  <img 
                    src={ss2} 
                    alt="Room Navigation" 
                    className="w-full h-full object-cover"
                  />
                ) : index === 2 ? (
                  <img 
                    src={ss3} 
                    alt="Real-Time Communication" 
                    className="w-full h-full object-cover"
                  />
                ) : index === 3 ? (
                  <img 
                    src={ss4} 
                    alt="Analytics and Insights" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#D9D9D9]" />
                )}
              </div>
              <h3 className="text-[32px] font-medium mb-4 text-black text-left w-[456px] h-[38px]">
                {feature.title}
              </h3>
              <div className="w-[456px] h-12 text-[20px] text-black text-left font-normal ">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;

