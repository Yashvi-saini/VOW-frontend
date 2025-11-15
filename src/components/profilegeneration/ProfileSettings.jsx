import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInfo, createProfile, uploadProfilePhoto } from "../../api/profileapi";
import { logoutUser } from "../../api/authApi";
import { setUserProfile } from "../userslice";
import Toast from "../common/Toast";

// Convert any date-like value to strict YYYY-MM-DD for <input type="date">
const toYYYYMMDD = (val) => {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const defaultAvatars = {
  male: "/avatars/male/avatar1.png",
  female: "/avatars/female/avatar1.png",
  other: "/avatars/other/avatar1.png",
};

const ProfileSettings = ({ onClose }) => {
  const rdxProfile = useSelector((s) => s.user?.profile);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gender: "other",
    dob: "",
    organisation: "",
    avatar: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [toast, setToast] = useState({ show: false, type: "info", message: "" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getProfileInfo();
        const data = res.data?.data || {};
        if (!mounted) return;
        setForm((f) => ({
          ...f,
          fullName: data.fullName || rdxProfile?.fullName || "",
          email: data.email || rdxProfile?.email || "",
          gender: (data.gender || rdxProfile?.gender || "other").toLowerCase(),
          dob: toYYYYMMDD(data.dob) || "",
          organisation: data.organisation || rdxProfile?.organisation || "",
          avatar: data.avatar || rdxProfile?.avatar || "",
        }));
      } catch (_) {
        setForm((f) => ({
          ...f,
          fullName: rdxProfile?.fullName || "",
          email: rdxProfile?.email || "",
          gender: (rdxProfile?.gender || "other").toLowerCase(),
          dob: toYYYYMMDD(rdxProfile?.dob) || "",
          organisation: rdxProfile?.organisation || "",
          avatar: rdxProfile?.avatar || "",
        }));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [rdxProfile]);

  const genderKey = form.gender || "other";
  const avatarSrc = form.avatar?.trim() ? form.avatar : defaultAvatars[genderKey] || defaultAvatars.other;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dob") {
      setForm((p) => ({ ...p, dob: toYYYYMMDD(value) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSave = async () => {
    setError("");
    try {
      setSaving(true);
      await createProfile({
        fullName: form.fullName,
        organisation: form.organisation,
        gender: form.gender,
        dob: toYYYYMMDD(form.dob) || "",
      });
      // Refresh profile info and update Redux so UI (Topbar/Sidebar) reflects immediately
      try {
        const refreshed = await getProfileInfo();
        const data = refreshed.data?.data || null;
        if (data) {
          // Prefer the just-uploaded avatar if available (backend may still return a default URL)
          const uploadedAvatar = localStorage.getItem("avatar") || rdxProfile?.avatar || "";
          const chosenAvatar = uploadedAvatar || data.avatar || "";
          if (chosenAvatar) {
            try { localStorage.setItem("avatar", chosenAvatar); } catch {}
          }
          dispatch(setUserProfile({
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            avatar: chosenAvatar,
            gender: data.gender,
            organisation: data.organisation,
          }));
          // Update local form state as well (cache-busted for immediate UI change)
          if (chosenAvatar) {
            setForm((p) => ({ ...p, avatar: `${chosenAvatar}?t=${Date.now()}` }));
          }
        }
      } catch {}
      // Success toast before closing
      setToast({ show: true, type: "success", message: "Profile saved successfully" });
      setTimeout(() => {
        onClose?.();
      }, 900);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to save changes");
      setToast({ show: true, type: "error", message: "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const res = await uploadProfilePhoto(file);
      const newUrl = res.data?.data?.avatar;
      if (newUrl) {
        // cache-bust
        const cacheBusted = `${newUrl}?t=${Date.now()}`;
        setForm((p) => ({ ...p, avatar: cacheBusted }));
        // Persist and update global profile so Sidebar/Topbar reflect new avatar instantly
        try { localStorage.setItem("avatar", newUrl); } catch {}
        const merged = rdxProfile ? { ...rdxProfile, avatar: newUrl } : { avatar: newUrl };
        dispatch(setUserProfile(merged));
        setToast({ show: true, type: "success", message: "Photo updated" });
      } else {
        setUploadError("Upload succeeded but no URL returned.");
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || "Failed to upload photo");
      setToast({ show: true, type: "error", message: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("workspaceId");
      localStorage.removeItem("inviteCode");
      localStorage.setItem("isLoggedIn", "false");
    } catch {}
    window.location.href = "/login";
  };

  if (loading) return null;

  return (
    <div className="max-w-3xl mx-auto relative px-4 sm:px-6">
      <h2 className="text-center text-lg sm:text-xl font-semibold text-[#2B2B2B] mb-4 sm:mb-6">Profile Settings</h2>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Avatar */}
        <div className="shrink-0 flex flex-col items-center gap-3 w-full sm:w-auto sm:items-start">
          <img src={avatarSrc} alt="avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border" />
          <label className="px-3 py-1.5 rounded-lg bg-[#450B7B] text-white text-xs cursor-pointer hover:brightness-110 transition">
            {uploading ? "Uploading..." : "Upload Photo"}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} className="hidden" />
          </label>
          {uploadError && <p className="text-[10px] text-red-500 max-w-[120px] text-center sm:text-left">{uploadError}</p>}
        </div>
        {/* Form */}
        <div className="flex-1 w-full space-y-3 sm:space-y-4 bg-white/60 p-4 sm:p-6 rounded-xl border">
          <div>
            <label className="block text-xs sm:text-sm text-[#2B2B2B] mb-1">Fullname</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full h-9 sm:h-10 border rounded-lg px-3 bg-white text-sm" placeholder="Editable text" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-[#2B2B2B] mb-1">Email id</label>
            <input value={form.email} disabled className="w-full h-9 sm:h-10 border rounded-lg px-3 bg-gray-100 text-gray-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-[#2B2B2B] mb-1">Gender</label>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              {[
                { k: "male", l: "Male" },
                { k: "female", l: "Female" },
                { k: "other", l: "Other" },
              ].map((g) => (
                <label key={g.k} className="flex items-center gap-1.5 sm:gap-2">
                  <input type="radio" name="gender" value={g.k} checked={form.gender === g.k} onChange={handleChange} />
                  <span>{g.l}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-[#2B2B2B] mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob || ""}
              onChange={handleChange}
              className="w-full h-9 sm:h-10 border rounded-lg px-3 bg-white text-sm"
            />
            <p className="text-[10px] text-[#707070] mt-1">Format: YYYY-MM-DD</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-[#2B2B2B] mb-1">Organization Name</label>
            <input name="organisation" value={form.organisation} onChange={handleChange} className="w-full h-9 sm:h-10 border rounded-lg px-3 bg-white text-sm" placeholder="Editable text" />
          </div>
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <button onClick={handleLogout} className="w-full sm:w-auto px-4 py-2 rounded-lg border bg-white text-[#450B7B] border-[#CCB4E3] text-sm sm:text-base">Log out</button>
            <button onClick={handleSave} disabled={saving} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#5E9BFF] text-white disabled:opacity-70 text-sm sm:text-base">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </div>
      </div>
      <Toast show={toast.show} type={toast.type} message={toast.message} />
    </div>
  );
};

export default ProfileSettings;
