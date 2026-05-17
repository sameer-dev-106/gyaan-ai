import React from "react";
import { Sparkles } from "lucide-react";

const EmptyState = () => (
  <div className="empty-state">
    <Sparkles size={32} className="empty-icon" />
    <h2>What do you want to know?</h2>
    <p>Ask me anything to start a new conversation.</p>
  </div>
);

export default EmptyState;
