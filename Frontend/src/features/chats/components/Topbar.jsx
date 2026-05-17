import React from "react";
import { PanelLeft, Plus, Sparkles } from "lucide-react";

const Topbar = ({ setSidebarOpen, chat }) => {
  return (
    <div className="topbar">
      <button
        className="icon-btn topbar-sidebar-btn"
        onClick={() => setSidebarOpen(true)}
      >
        <div className="icon-slot">
          <Sparkles className="icon-sparkles" size={16} />
          <PanelLeft className="icon-panel" size={16} />
        </div>
      </button>
      <span className="topbar-title">Gyaan AI</span>
      <button className="icon-btn plus-btn" onClick={() => chat.handleNewChat()}>
        <Plus size={18} />
      </button>
    </div>
  );
};

export default Topbar;
