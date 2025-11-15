import React, { useState } from "react";
import { createProfile,uploadProfilePhoto } from "../../api/profileapi";
import backarrow from "../../assets/back.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile ,setProfileNeeded} from "../userslice";


const ProfileForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    organisation: "",
    dob: "",
  });

const [selectedFile, setSelectedFile] = useState(null);
const [preview,setPreview]= useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = "Name can only contain letters and spaces.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
    }

    if (!formData.organisation.trim()) {
      newErrors.organisation = "Organisation is required.";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required.";
    } else {
      const dob = new Date(formData.dob);
      const age =
        (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 10 || age > 100) {
        newErrors.dob = "Please enter a valid age (10–100 years).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setApiError("");
      const payload = {
        fullName: formData.fullName,
        organisation: formData.organisation,
        gender: formData.gender.toLowerCase(),
        dob: formData.dob,
      };
      const response = await createProfile(payload);

      if (response.data?.success) {
  const profile = response.data.data; // ✅ grab the profile object

  // Persist avatar for refresh (optional)
  if (profile.avatar) {
    localStorage.setItem("avatar", profile.avatar);
  }

  // Update Redux so UI reflects new profile immediately
  dispatch(setUserProfile({
    username: profile.username,   // if backend returns it
    fullName: profile.fullName,
    email: profile.email,         // if backend returns it
    avatar: profile.avatar,
  }));

  dispatch(setProfileNeeded(false)); // ✅ mark profile complete
  

  onSubmit?.(profile);
} else {
  setApiError(response.data?.msg || "Failed to save profile.");

      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setApiError(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-[570px] mx-auto bg-[#FAFAFA] px-4 sm:px-8 md:px-10 py-6 sm:py-8 rounded-2xl shadow-lg flex flex-col justify-center min-h-[500px]"
    >
      <div
        className="absolute top-3 left-3 sm:top-5 sm:left-5 cursor-pointer"
        onClick={() => navigate(-1)}
      >
       <img
          src={backarrow}
          alt="Back"
          className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 transition"
        />
       </div>
        {/* Header */}
        <div className="text-[#0E1219] text-xl sm:text-2xl md:text-[32px] font-semibold leading-tight text-center mb-2 px-2">
          Create Your VOW Profile
        </div>
        <div className="text-[#707070] text-sm sm:text-base font-normal leading-relaxed text-center mb-4 sm:mb-6 px-2">
          Let's personalize your experience. Start by filling in your details
          below.
        </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-3 sm:gap-4 overflow-y-auto px-2"
      >
        {/* Full Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#1F2937] mb-1">
            Full Name:
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            maxLength={30}
            onChange={handleChange}
            placeholder="Use your real or professional name"
            className="w-full border border-[#707070] rounded-lg p-2 sm:p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <p className="text-xs text-red-500 min-h-4 mt-1">
            {errors.fullName || ""}
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#1F2937] mb-2">
            Gender:
          </label>
          <div className="flex gap-4 sm:gap-8 md:gap-12 flex-wrap">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-[#2B2B2B] text-sm">{g}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.gender || ""}
          </p>
        </div>

        {/* Organisation */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#1F2937] mb-1">
            Organisation:
          </label>
          <input
            type="text"
            name="organisation"
            value={formData.organisation}
            onChange={handleChange}
            placeholder="Enter your organisation name"
            className="w-full border border-[#707070] rounded-lg p-2 sm:p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.organisation || ""}
          </p>
        </div>

        {/* DOB */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#1F2937] mb-1">
            Date of Birth:
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className="w-full border border-[#707070] rounded-lg p-2 sm:p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.dob || ""}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`text-white font-medium py-2 sm:py-2.5 w-full mt-4 sm:mt-6 rounded-lg transition text-sm sm:text-base ${
            loading
              ? "opacity-80"
              : "bg-[#450B7B]"
          }`}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

        <p className="text-center text-sm text-red-500 min-h-[10px] mt-2">
          {apiError || ""}
        </p>
      </form>
    </div>
  );
};

export default ProfileForm;
