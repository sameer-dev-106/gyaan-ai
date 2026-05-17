import React from "react";
import { Sparkles } from "lucide-react";

const TypingIndicator = () => (
  <div className="message ai">
    <div className="ai-avatar">
      <Sparkles size={12} />
    </div>
    <div className="bubble typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

export default TypingIndicator;
