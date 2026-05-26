import React from "react";
import { Plus, Search } from "lucide-react";

const SidebarActions = ({ chat, setSidebarOpen, onSearchOpen }) => {
  const handleNewChat = () => {
    chat.handleNewChat();
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="sidebar-actions">
      <button className="new-chat-btn" onClick={handleNewChat}>
        <Plus size={15} />
        <span>New Chat</span>
      </button>
      <button className="search-btn" onClick={onSearchOpen}>
        <Search size={15} />
        <span>Search</span>
      </button>
    </div>
  );
};

export default SidebarActions;
