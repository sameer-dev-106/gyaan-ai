import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Sparkles,
  Trash2,
  Pencil,
  Check,
  X,
  Copy,
  CheckCheck,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { updateMessage } from "../chat.slice";
import "katex/dist/katex.min.css";

const MermaidBlock = lazy(() => import("./MermaidBlock"));

const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") || "";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (language === "mermaid")
    return (
      <Suspense
        fallback={<div className="mermaid-loading">Loading diagram...</div>}
      >
        <MermaidBlock code={code} />
      </Suspense>
    );

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{language || "code"}</span>
        <button
          className="code-copy-btn"
          onClick={handleCopy}
          title="Copy code"
        >
          {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: "0 0 10px 10px",
          background: "rgba(0,0,0,0.45)",
          fontSize: "13px",
          lineHeight: "1.6",
        }}
        codeTagProps={{ style: { fontFamily: "monospace" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const MessageItem = ({ msg, msgIndex, currentChatId, onDeleteMessage }) => {
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
    if (!msg._id) return;
    onDeleteMessage({ chatId: currentChatId, messageId: msg._id, msgIndex });
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
    if (e.key === "Escape") handleEditCancel();
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
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <p className="markdown-p">{children}</p>,
                  ul: ({ children }) => (
                    <ul className="markdown-ul">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="markdown-ol">{children}</ol>
                  ),
                  code: ({ inline, className, children }) =>
                    inline ? (
                      <code className="markdown-inline-code">{children}</code>
                    ) : (
                      <CodeBlock className={className}>{children}</CodeBlock>
                    ),
                  pre: ({ children }) => <>{children}</>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            ) : (
              msg.content
            )}
          </div>
        )}

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
            {msg._id && (
              <button
                className="msg-action-btn delete"
                onClick={handleDelete}
                title={
                  msg.role === "user"
                    ? "Delete this and all messages after it"
                    : "Delete message"
                }
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
