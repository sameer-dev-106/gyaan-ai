import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";

const MessageItem = ({ msg }) => (
  <div className={`message ${msg.role}`}>
    {msg.role === "ai" && (
      <div className="ai-avatar">
        <Sparkles size={12} />
      </div>
    )}

    <div className="bubble">
      {msg.role === "ai" ? (
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="markdown-p">{children}</p>
            ),
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
  </div>
);

export default MessageItem;
