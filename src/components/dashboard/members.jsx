import React, { useState } from "react";
import { getMembers } from "../../api/authApi"; 

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);


  const handleFetchMembers = async () => {
  const workspaceId = localStorage.getItem("workspaceId");
  const workspaceToken = localStorage.getItem("workspaceToken");

  if (!workspaceId || !workspaceToken) {
    alert("Missing workspace credentials");
    return;
  }

  setLoading(true);
  try {
    const response = await getMembers(workspaceId, workspaceToken);
    if (response.data.success) {
      setMembers(response.data.members);
      setShowList(true);
    } else {
      alert("Failed to fetch members");
    }
  } catch (error) {
    console.error("Error fetching members:", error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#450B7B] mb-4 text-center">
          Members
        </h2>

        <button
          onClick={handleFetchMembers}
          disabled={loading}
          className="w-full bg-[#450B7B] text-white px-4 py-2 rounded-md hover:bg-[#5c0ea4] transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Show Members"}
        </button>

        {showList && (
  members.length === 0 ? (
    <p className="mt-6 text-center text-gray-600">No members found.</p>
  ) : (
    <ul className="mt-6 space-y-2">
      {members.map((member, index) => (
        <li
          key={index}
          className="text-sm text-gray-800 bg-[#F3F3F6] p-2 rounded-md border border-[#BCBCBC]"
        >
          {member}
        </li>
      ))}
    </ul>
  )
)}
      </div>
    </div>
  );
};

export default MembersList;