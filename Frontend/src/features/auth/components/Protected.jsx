import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const [slowLoad, setSlowLoad] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlowLoad(true), 3000);
    return () => clearTimeout(t);
  }, []);
  const initialized = useSelector((state) => state.auth.initialized);

  if (loading || !initialized) {
    return (
      <div
        style={{
          width: "100%",
          height: "100dvh",
          background: "#0d0d0d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            border: "2px solid rgba(255,255,255,0.1)",
            borderTop: "2px solid #f33939",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        {slowLoad && (
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 13,
              marginTop: 16,
            }}
          >
            Server waking up, please wait...
          </p>
        )}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
