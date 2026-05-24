import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ArrowUp, AlertTriangle } from "lucide-react";

const InputArea = ({
  textareaRef,
  inputValue,
  setInputValue,
  isLoading,
  isStreaming,
  chat,
  currentChatIdRef,
}) => {
  const navigate = useNavigate();
  const isBusy = isLoading || isStreaming;
  const tokenLimitError = useSelector((state) => state.chat.tokenLimitError);
  const tokensUsed = useSelector((state) => state.auth.user?.tokensUsed ?? 0);
  const tokenLimit = useSelector(
    (state) => state.auth.user?.tokenLimit ?? 50000,
  );

  const autoResize = (el) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    autoResize(e.target);
  };

  const handleSend = () => {
    if (!inputValue.trim() || isBusy || tokenLimitError) return;
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
      {tokenLimitError && (
        <div className="token-limit-banner">
          <AlertTriangle size={15} />
          <span>
            Daily limit reached ({tokensUsed.toLocaleString()} /{" "}
            {tokenLimit.toLocaleString()} tokens). Resets in 24h.
          </span>
          <button onClick={() => navigate("/settings")}>View Usage</button>
        </div>
      )}

      <div className="input-container">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder={
            tokenLimitError ? "Daily limit reached..." : "Ask anything..."
          }
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isBusy || tokenLimitError}
        />
        <button
          className={`send-btn ${inputValue.trim() && !isBusy && !tokenLimitError ? "active" : ""}`}
          disabled={!inputValue.trim() || isBusy || tokenLimitError}
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
