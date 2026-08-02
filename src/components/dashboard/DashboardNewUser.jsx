import React, { useState } from "react";
import keyIcon from "../../assets/Key.svg";
import { joinWorkspace } from "../../api/workspaceApi.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setWorkspaceContext } from "../userslice";

const DashboardNewUser = ({ onCreate }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const card =
    "rounded-[16px] border border-[#8F7AA9] bg-[#EFE7F6] p-6 flex flex-col items-center text-center gap-4 min-h-[200px]";
  const primaryBtn =
    "bg-[#5E9BFF] hover:bg-[#4A8CE0] text-white px-6 py-2.5 rounded-lg transition border border-[#1F2937] cursor-pointer";
  const secondaryBtn =
    "bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#000] px-6 py-2.5 rounded-lg transition border border-[#1F2937] cursor-pointer";

  const handleJoin = async () => {
    const codeToJoin = inviteCode.trim();
    if (!codeToJoin) {
      setError("Please enter a workspace ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await joinWorkspace(codeToJoin);
      const data = response.data;

      if (!data.success && data.msg === "User is already a member") {
        setError("You are already a member of this workspace");
        return;
      }

      if (data.success && data.workspace) {
        const { _id, inviteCode: code, workspaceName } = data.workspace;
        localStorage.setItem("workspaceId", _id);
        localStorage.setItem("inviteCode", code);
        dispatch(
          setWorkspaceContext({
            workspaceId: _id,
            workspaceToken: null,
            workspaceName,
          })
        );
        navigate(`/workspace/${_id}/chat`);
      } else {
        setError(data.message || data.msg || "Incorrect workspace ID");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "Incorrect workspace ID";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative z-10">     
        <div className="mx-[88px] max-w-[944px] flex flex-col gap-10">         
          <div className="grid grid-cols-2 gap-10">
            <div className={card}>
              <h3 className="font-bold text-[24px] text-[#000]">Create Workspace</h3>
              <p className="text-[16px] text-[#000] opacity-80">
                Perfect for new teams or fresh projects.
              </p>
              <button type="button" onClick={onCreate} className={primaryBtn}>Create</button>
            </div>

            {/* Join Workspace */}
            <div className={card}>
              <h3 className="font-bold text-[24px] text-[#000]">Join New Workspace</h3>
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleJoin();
                  }}
                  placeholder="Enter the Workspace ID to join"
                  className="w-full h-10 rounded-lg border border-[#707070] bg-white pl-3 pr-10 text-sm text-[#0E1219] placeholder:text-[#707070] focus:outline-none focus:border-[#5E9BFF]"
                />
                <img
                  src={keyIcon}
                  alt="key"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60 pointer-events-none"
                />
              </div>
              {error && (
                <p className="text-[#CC0404] text-[13px] font-medium">{error}</p>
              )}
              <button
                type="button"
                onClick={handleJoin}
                disabled={loading}
                className={primaryBtn}
              >
                {loading ? "Joining..." : "Join Now"}
              </button>
            </div>
          </div>

          {/* Tutorial card */}
          <div className="rounded-[16px] ">
            <div className="w-full h-[280px] rounded-[12px] bg-[#9FA3A9] flex items-center justify-center text-[#000]">
             
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-[#000] text-[16px] leading-6">
                New to Vow? Watch a short video to learn how to create spaces, invite your team,
                and get the most out of your workspace.
              </p>
              <div className="flex gap-4">
                <button className={`${primaryBtn} leading-[18px]`}>
                  Watch
                  <br />
                  Now
                </button>
                <button type="button" onClick={onCreate} className={secondaryBtn}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewUser;
