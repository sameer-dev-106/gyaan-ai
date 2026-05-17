import React from "react";
import { IconSettings } from "../icons/Dashboard.Icons";

const ProfileSection = ({ user }) => (
  <div className="profile">
    <div className="avatar">
      {user?.username?.charAt(0)?.toUpperCase() || "S"}
    </div>
    <span className="username">{user?.username}</span>
    <button className="icon-btn">
      <IconSettings size={17} />
    </button>
  </div>
);

export default ProfileSection;
