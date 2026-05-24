import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { IconSettings } from "../icons/Dashboard.Icons";

const ProfileSection = ({ user }) => {
  const navigate = useNavigate();
  const tokensUsed = useSelector((state) => state.auth.user?.tokensUsed ?? 0);
  const tokenLimit = useSelector(
    (state) => state.auth.user?.tokenLimit ?? 50000,
  );
  const tokenPercent = Math.min(
    Math.round((tokensUsed / tokenLimit) * 100),
    100,
  );

  return (
    <div className="profile">
      <div className="avatar">
        {user?.username?.charAt(0)?.toUpperCase() || "S"}
      </div>
      <div className="profile-info">
        <span className="username">{user?.username}</span>
        {/* Token usage mini-bar */}
        <div
          className="token-mini-bar-wrapper"
          title={`${tokensUsed} / ${tokenLimit} tokens used`}
        >
          <div
            className={`token-mini-bar-fill ${tokenPercent >= 90 ? "danger" : tokenPercent >= 70 ? "warning" : ""}`}
            style={{ width: `${tokenPercent}%` }}
          />
        </div>
      </div>
      <button
        className="icon-btn"
        onClick={() => navigate("/settings")}
        title="Settings"
      >
        <IconSettings size={17} />
      </button>
    </div>
  );
};

export default ProfileSection;
