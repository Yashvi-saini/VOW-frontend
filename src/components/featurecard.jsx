import React from 'react';

const features = [
  {
    title: 'Custom Virtual Offices',
    description: 'Create rooms, meeting halls, and unique experiences designed for your team\'s workflow.',
  },
  {
    title: 'Real-Time Communication',
    description: 'Video, voice, and chat — all integrated perfectly in one digital workspace.',
  },
  {
    title: 'Smart Navigation',
    description: 'Move freely between rooms and offices, like you would in a real workspace.',
  },
  {
    title: 'Analytics & Insights',
    description: 'Track attendance, engagement, resource activity — all in one dashboard.',
  },
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-purple-50 rounded-lg p-4 shadow-md text-left"
        >
          <div className="bg-purple-200 h-24 w-full rounded-md mb-4" />
          <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
