import React from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";

const ChatItem = ({
  chatItem,
  currentChatId,
  hoveredChatId,
  openMenuChatId,
  setHoveredChatId,
  setOpenMenuChatId,
  chat,
  chats,
}) => {
  const isActive = chatItem.id === currentChatId;
  const showActions =
    hoveredChatId === chatItem.id || openMenuChatId === chatItem.id;

  const openChat = () => chat.handleOpenChat(chatItem.id, chats);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setOpenMenuChatId(openMenuChatId === chatItem.id ? null : chatItem.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setOpenMenuChatId(null);
    chat.handleDeleteChat(chatItem.id);
  };

  return (
    <div
      className={`chat-item-wrapper ${isActive ? "active" : ""}`}
      onMouseEnter={() => setHoveredChatId(chatItem.id)}
      onMouseLeave={() => setHoveredChatId(null)}
    >
      <button onClick={openChat} className="chat-item">
        <span className="chat-title">
          {chatItem.title?.replace(/^"|"$/g, "")}
        </span>
      </button>

      {showActions && (
        <div className="chat-actions">
          <button className="chat-menu-btn" onClick={handleMenuOpen}>
            <MoreHorizontal size={14} />
          </button>

          {openMenuChatId === chatItem.id && (
            <div className="chat-dropdown">
              <button
                className="chat-dropdown-item delete"
                onClick={handleDelete}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
