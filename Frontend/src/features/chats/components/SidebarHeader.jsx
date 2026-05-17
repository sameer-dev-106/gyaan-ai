import React from "react";
import { PanelLeft, Sparkles } from "lucide-react";

const SidebarHeader = ({ setSidebarOpen }) => (
  <div className="sidebar-header">
    <div className="logo-area">
      <Sparkles size={16} className="logo-icon" />
      <span className="logo-text">Gyaan AI</span>
    </div>
    <button className="icon-btn" onClick={() => setSidebarOpen(false)}>
      <PanelLeft size={18} />
    </button>
  </div>
);

export default SidebarHeader;
