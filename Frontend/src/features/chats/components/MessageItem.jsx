import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Trash2, Pencil, Check, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteMessage, updateMessage } from "../chat.slice";

const MessageItem = ({ msg, msgIndex, currentChatId }) => {
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(msg.content);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editing]);

  const handleDelete = () => {
    dispatch(deleteMessage({ chatId: currentChatId, msgIndex }));
  };

  const handleEditSave = () => {
    if (editContent.trim() && editContent.trim() !== msg.content) {
      dispatch(
        updateMessage({
          chatId: currentChatId,
          msgIndex,
          content: editContent.trim(),
        }),
      );
    }
    setEditing(false);
  };

  const handleEditCancel = () => {
    setEditContent(msg.content);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    }
    if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <div
      className={`message ${msg.role}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {msg.role === "ai" && (
        <div className="ai-avatar">
          <Sparkles size={12} />
        </div>
      )}

      <div className="bubble-wrapper">
        {editing ? (
          <div className="message-edit-area">
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => {
                setEditContent(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={handleKeyDown}
              className="message-edit-textarea"
              rows={1}
            />
            <div className="edit-actions">
              <button
                className="edit-action-btn confirm"
                onClick={handleEditSave}
                title="Save (Enter)"
              >
                <Check size={13} />
              </button>
              <button
                className="edit-action-btn cancel"
                onClick={handleEditCancel}
                title="Cancel (Esc)"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bubble">
            {msg.role === "ai" ? (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="markdown-p">{children}</p>,
                  ul: ({ children }) => (
                    <ul className="markdown-ul">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="markdown-ol">{children}</ol>
                  ),
                  code: ({ children }) => (
                    <code className="markdown-code">{children}</code>
                  ),
                  pre: ({ children }) => (
                    <pre className="markdown-pre">{children}</pre>
                  ),
                }}
                remarkPlugins={[remarkGfm]}
              >
                {msg.content}
              </ReactMarkdown>
            ) : (
              msg.content
            )}
          </div>
        )}

        {/* Action buttons - streaming ke time nahi dikhenge */}
        {!editing && !msg.isStreaming && hovered && (
          <div className={`msg-actions ${msg.role}`}>
            {msg.role === "user" && (
              <button
                className="msg-action-btn edit"
                onClick={() => setEditing(true)}
                title="Edit message"
              >
                <Pencil size={12} />
              </button>
            )}
            <button
              className="msg-action-btn delete"
              onClick={handleDelete}
              title="Delete message"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
