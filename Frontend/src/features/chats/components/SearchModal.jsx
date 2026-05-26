import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, MessageSquare, Clock } from "lucide-react";

const SearchModal = ({ isOpen, onClose, chats, onSelectChat }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Filter + sort chats
  const results = useMemo(() => {
    const all = Object.values(chats).sort(
      (a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate),
    );
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter((c) => c.title?.toLowerCase().includes(q));
  }, [chats, query]);

  // Time label
  function timeLabel(dateStr) {
    if (!dateStr) return "";
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <Search size={16} className="search-icon" />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search chats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery("")}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty">
              <MessageSquare size={28} />
              <p>No chats found</p>
              <span>Try a different keyword</span>
            </div>
          ) : (
            <>
              <p className="search-results-label">
                {query
                  ? `${results.length} result${results.length !== 1 ? "s" : ""}`
                  : "Recent chats"}
              </p>
              <div className="search-results-list">
                {results.map((chatItem) => (
                  <button
                    key={chatItem.id}
                    className="search-result-item"
                    onClick={() => {
                      onSelectChat(chatItem.id);
                      onClose();
                    }}
                  >
                    <div className="search-result-icon">
                      <MessageSquare size={14} />
                    </div>
                    <span className="search-result-title">
                      {chatItem.title || "Untitled Chat"}
                    </span>
                    <span className="search-result-time">
                      <Clock size={11} />
                      {timeLabel(chatItem.lastUpdate)}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="search-footer">
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span>
            <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
