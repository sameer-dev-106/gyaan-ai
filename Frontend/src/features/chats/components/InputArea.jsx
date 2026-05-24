import React from "react";
import { ArrowUp } from "lucide-react";

const InputArea = ({
  textareaRef,
  inputValue,
  setInputValue,
  isLoading,
  isStreaming,
  chat,
  currentChatIdRef,
}) => {
  const isBusy = isLoading || isStreaming;

  const autoResize = (el) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    autoResize(e.target);
  };

  const handleSend = () => {
    if (!inputValue.trim() || isBusy) return;

    chat.handleSendMessage({
      message: inputValue,
      chatId: currentChatIdRef.current,
    });

    setInputValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <div className="input-container">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Ask anything..."
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isBusy}
        />
        <button
          className={`send-btn ${inputValue.trim() && !isBusy ? "active" : ""}`}
          disabled={!inputValue.trim() || isBusy}
          onClick={handleSend}
        >
          <ArrowUp size={17} />
        </button>
      </div>

      <p className="input-hint">
        {isStreaming
          ? "Gyaan AI is typing..."
          : "Gyaan AI can make mistakes. Verify important info."}
      </p>
    </div>
  );
};

export default InputArea;
