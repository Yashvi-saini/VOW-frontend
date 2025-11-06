import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import {uploadProfilePhoto} from "../../api/profileapi";

const defaultAvatars = {
  male: "/avatars/male/avatar1.png",
  female: "/avatars/female/avatar1.png",
  other: "/avatars/other/avatar1.png",
};

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();

  const [avatarUrl,setAvatarUrl]=useState(profile?.avatar||"");
  const [uploading,setUploading]=useState(false);
  if (!profile) return null;

  const genderKey = profile.gender?.toLowerCase() || "other";
  const avatarSrc = avatarUrl?.trim() ? avatarUrl 
    : defaultAvatars[genderKey] || defaultAvatars.other;


    const handleFilechange =async (e)=>{
      const file = e.target.files[0];
      if(!file) return;
      setUploading(true);
      try{
        const res = await uploadProfilePhoto(file);
        if(res.data?.success){
          const newAvatar=`${res.data.data.avatar}?t=${new Date().getTime()}`;
          setAvatarUrl(newAvatar);
        }

      }catch(error){
        console.error("Error uploading profile photo:", error);
        alert("Failed to upload profile photo. Please try again.");
      }finally{
        setUploading(false);
      }
    };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-gradient-to-br from-[#FAFAFA] to-[#F3E8FF] p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
      
      {/* Header Section */}
      <h1 className="text-2xl font-semibold text-[#450B7B] mb-1">
        Your details are ready!
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Here’s a summary of your VOW profile information.
      </p>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <img
          src={avatarSrc}
          alt={`${profile.fullName}'s Avatar`}
          className="w-28 h-28 rounded-full border-4 border-[#450B7B] object-cover shadow-md"
          onError={(e) => (e.target.src = defaultAvatars[genderKey])}
        />
        {/*custom profile photo*/ }
        <label
          className="mt-3 text-sm text-[#450B7B] font-medium cursor-pointer hover:underline">
          {uploading ? "Uploading..." : "upload custom photo"}
         <input
          type="file"
          accept="image/"
          onChange={handleFilechange}
          className="hidden"
          disabled ={uploading}
         />
          </label>

      </div>

      {/* Profile Info */}
      <div className="mt-5 space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">{profile.fullname}</h2>
        <p className="text-gray-500 text-sm">{profile.organisation}</p>

        <div className="text-gray-600 text-sm mt-3 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Gender:</span>{profile.gender}
          </p>
          <p>
            <span className="font-medium text-gray-700">DOB:</span>{profile.dob}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mt-6 mb-4"></div>

      {/* Action Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="w-full bg-[#450B7B] hover:bg-[#5A20A0] text-white py-2.5 rounded-lg font-medium shadow-md transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default ProfileCard;




