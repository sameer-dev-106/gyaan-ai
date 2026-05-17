import React from "react";
import EmptyState from "./EmptyState";
import MessageItem from "./MessageItem";
import TypingIndicator from "./TypingIndicator";

const MessagesSection = ({
  chats,
  currentChatId,
  isLoading,
  messagesEndRef,
}) => (
  <div className="messages-wrapper">
    <div className="messages">
      {!currentChatId && <EmptyState />}

      {chats[currentChatId]?.messages?.map((msg, idx) => (
        <MessageItem key={idx} msg={msg} />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  </div>
);

export default MessagesSection;
