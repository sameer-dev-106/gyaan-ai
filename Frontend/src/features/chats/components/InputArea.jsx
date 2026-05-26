import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ArrowUp, AlertTriangle, Zap } from "lucide-react";

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
    (state) => state.auth.user?.tokenLimit ?? 5000,
  );

  const tokenPercent = Math.min(
    Math.round((tokensUsed / tokenLimit) * 100),
    100,
  );
  const isWarning = tokenPercent >= 80 && tokenPercent < 100;
  const isDanger = tokenPercent >= 100 || tokenLimitError;
  const tokensLeft = Math.max(0, tokenLimit - tokensUsed);

  const autoResize = (el) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    autoResize(e.target);
  };

  const handleSend = () => {
    if (!inputValue.trim() || isBusy || isDanger) return;
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
      {/* ── Token limit FULL — hard block ── */}
      {isDanger && (
        <div className="token-limit-banner danger-banner">
          <AlertTriangle size={15} />
          <span>
            Aaj ke tokens khatam ho gaye ({tokensUsed.toLocaleString()} /{" "}
            {tokenLimit.toLocaleString()}). 24 ghante baad reset hoga. ⏳
          </span>
          <button onClick={() => navigate("/settings")}>Usage dekho</button>
        </div>
      )}

      {/* ── Warning — 80%+ used, still can send ── */}
      {isWarning && !isDanger && (
        <div className="token-limit-banner warning-banner">
          <Zap size={14} />
          <span>
            Sirf {tokensLeft.toLocaleString()} tokens bache hain aaj ke liye.
          </span>
        </div>
      )}

      <div className={`input-container ${isDanger ? "input-frozen" : ""}`}>
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder={
            isDanger
              ? "Daily limit khatam... kal aana 👋"
              : isWarning
                ? `Thode tokens bache hain (${tokensLeft} left)...`
                : "Ask anything..."
          }
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isBusy || isDanger}
        />
        <button
          className={`send-btn ${inputValue.trim() && !isBusy && !isDanger ? "active" : ""}`}
          disabled={!inputValue.trim() || isBusy || isDanger}
          onClick={handleSend}
        >
          <ArrowUp size={17} />
        </button>
      </div>

      <p className="input-hint">
        {isStreaming
          ? "Gyaan AI is typing..."
          : isDanger
            ? "Token limit reached. Resets in 24h."
            : "Gyaan AI can make mistakes. Verify important info."}
      </p>
    </div>
  );
};

export default InputArea;
