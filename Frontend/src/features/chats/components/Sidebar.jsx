import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarActions from "./SidebarActions";
import ChatsList from "./ChatsList";
import ProfileSection from "./ProfileSection";

const Sidebar = (props) => {
  const { sidebarOpen, setSidebarOpen } = props;

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className="asideNav">
        <SidebarHeader setSidebarOpen={setSidebarOpen} />
        <SidebarActions {...props} />
        <ChatsList {...props} />
        <ProfileSection user={props.user} />
      </aside>
    </>
  );
};

export default Sidebar;
