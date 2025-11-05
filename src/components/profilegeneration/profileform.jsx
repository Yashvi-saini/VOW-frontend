import React, { useState } from "react";
import { createProfile } from "../../api/profileapi";
import backarrow from "../../assets/back.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../userslice";


const ProfileForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    organisation: "",
    dob: "",
  });

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
        const { avatar, fullName } = response.data.data;
        // Persist avatar for refresh (optional); do not persist fullName to LS
        if (avatar) localStorage.setItem("avatar", avatar);
        // Update Redux so UI reflects new profile immediately
        dispatch(setUserProfile({ fullName, avatar }));
        onSubmit?.(response.data.data);
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
      className="w-[570px] h-[689px] bg-[#FAFAFA] px-[40px] py-[20px] rounded-2xl shadow-lg flex flex-col justify-center"
    >
      <div
        className="absolute top-[20px] left-[20px] cursor-pointer"
        onClick={() => navigate(-1)}
      >
       <img
          src={backarrow}
          alt="Back"
          className="w-6 h-6 hover:opacity-80 transition"
        />
       </div>
        {/* Header */}
        <div className="text-[#0E1219] text-[32px] font-semibold leading-[48px] w-[414px] h-[48px] text-center ml-[50px] mr-[60px] mb-[2px]">
          Create Your VOW Profile
        </div>
        <div className="text-[#707070] text-[16px] font-normal leading-[24px] w-[414px] h-[48px] text-center ml-[50px] mr-[60px] mb-[10px]">
          Let’s personalize your experience. Start by filling in your details
          below.
        </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-2 overflow-y-auto "
      >
        {/* Full Name */}
        <div className="ml-[50px] mr-[60px]">
          <label className="block text-sm font-medium text-[#1F2937] mb-1">
            Full Name:
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Use your real or professional name"
            className="w-[414px] border border-[#707070] rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.fullName || ""}
          </p>
        </div>

        {/* Gender */}
        <div className="ml-[50px] mr-[60px]">
          <label className="block text-sm font-medium text-[#1F2937] mb-2">
            Gender:
          </label>
          <div className="flex gap-24">
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
                <span className="text-[#2B2B2B]">{g}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.gender || ""}
          </p>
        </div>

        {/* Organisation */}
        <div className="ml-[50px] mr-[60px]">
          <label className="block text-sm font-medium text-[#1F2937] mb-1">
            Organisation:
          </label>
          <input
            type="text"
            name="organisation"
            value={formData.organisation}
            onChange={handleChange}
            placeholder="Enter your organisation name"
            className="w-[414px] border border-[#707070] rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.organisation || ""}
          </p>
        </div>

        {/* DOB */}
        <div className="ml-[50px] mr-[60px]">
          <label className="block text-sm font-medium text-[#1F2937] mb-1">
            Date of Birth:
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className="w-[414px] border border-[#707070] rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <p className="text-xs text-red-500 min-h-[16px] mt-1">
            {errors.dob || ""}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={` text-white font-medium py-2.5 ml-[50px] w-[414px] mt-[32px] rounded-lg transition  ${
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




