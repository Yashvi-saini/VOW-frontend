import React from "react";

const SupervisorMeeting = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">
      Set Reminder
    </h2>
    <form className="space-y-4">
      <input type="text" placeholder="Organizer" className="w-full border rounded-lg p-3" />
      <input type="date" className="w-full border rounded-lg p-3" />
      <textarea placeholder="Agenda / Description" className="w-full border rounded-lg p-3"></textarea>
      <button className="bg-[#8231CC] text-white px-5 py-2 rounded-lg hover:bg-[#29064A]">
        Save Reminder
      </button>
    </form>
  </div>
);

export default SupervisorMeeting;
