import React from "react";
import ChatItem from "./ChatItem";

const ChatsList = (props) => (
  <div className="chats-section">
    <p className="section-label">Recent</p>
    <div className="chats-list">
      {Object.values(props.chats).map((chatItem) => (
        <ChatItem key={chatItem.id} chatItem={chatItem} {...props} />
      ))}
    </div>
  </div>
);

export default ChatsList;
