import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Toast = ({ message, type = "error", onClose, duration = 4000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);

    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [message]);

  const isError = type === "error";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "-20px"})`,
        opacity: visible ? 1 : 0,
        transition: "all 0.3s ease",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        borderRadius: "10px",
        background: isError ? "#1e0a0a" : "#0a1e0e",
        border: `1px solid ${isError ? "rgba(243,57,57,0.4)" : "rgba(34,197,94,0.4)"}`,
        boxShadow: `0 4px 24px ${isError ? "rgba(243,57,57,0.15)" : "rgba(34,197,94,0.15)"}`,
        maxWidth: "420px",
        width: "calc(100vw - 40px)",
        backdropFilter: "blur(10px)",
      }}
    >
      {isError ? (
        <XCircle size={18} style={{ color: "#f33939", flexShrink: 0 }} />
      ) : (
        <CheckCircle size={18} style={{ color: "#22c55e", flexShrink: 0 }} />
      )}

      <span
        style={{
          color: isError ? "#f09090" : "#86efac",
          fontSize: "14px",
          fontFamily: "'Geist', system-ui, sans-serif",
          flex: 1,
          lineHeight: 1.4,
        }}
      >
        {message}
      </span>

      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: isError ? "rgba(240,144,144,0.5)" : "rgba(134,239,172,0.5)",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
