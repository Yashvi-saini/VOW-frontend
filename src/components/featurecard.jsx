import React from "react";

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
              className="flex-none w-[472px] h-[424px] bg-[#EBE2F6] p-[8px] mr-[65px]"
            >
              <div className="w-full h-[288px] mb-4 bg-[#D9D9D9] " />
              <h3 className="text-[32px] font-medium mb-[16px] text-black text-left w-[456px] h-[38px] ">
                {feature.title}
              </h3>
              <div className="w-[456px] h-[48px] text-[20px] text-[#000] text-left font-normal">
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

