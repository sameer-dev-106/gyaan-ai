import React from "react";
import { Link, useLocation } from "react-router";
import { MailCheck } from "lucide-react";
import styles from "../style/auth.module.scss";
import AuthLeft from "../components/AuthLeft";

const CheckInbox = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className={styles.authPage}>
      <AuthLeft
        title="One last step."
        subtitle="Verify your email to unlock your Gyaan AI account and start your learning journey."
        features={[
          "AI-powered personalized learning",
          "Smart quizzes & instant feedback",
          "Track progress across subjects",
        ]}
      />

      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              background: "rgba(243,57,57,0.1)",
              border: "1px solid rgba(243,57,57,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "28px",
            }}
          >
            <MailCheck size={28} color="#f33939" />
          </div>

          <div className={styles.heading}>
            <h1>Check your inbox</h1>
            <p>We've sent a verification link to</p>
          </div>

          {/* Email badge */}
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(243,57,57,0.08)",
              border: "1px solid rgba(243,57,57,0.2)",
              color: "#ef9e9e",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "28px",
              wordBreak: "break-all",
            }}
          >
            {email}
          </div>

          {/* Steps */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "28px",
            }}
          >
            {[
              "Open the email from Gyaan AI",
              'Click the "Verify Email" link',
              "Come back and complete your profile",
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 0",
                  borderBottom:
                    i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(243,57,57,0.15)",
                    border: "1px solid rgba(243,57,57,0.3)",
                    color: "#f33939",
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{ color: "rgba(239,158,158,0.8)", fontSize: "14px" }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Warning note */}
          <p
            style={{
              fontSize: "13px",
              color: "rgba(239,158,158,0.5)",
              textAlign: "center",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            ⚠️ Without email verification, you won't be able to log in. Check
            your spam folder if you don't see the email.
          </p>

          {/* Primary CTA: Go to Login */}
          <Link to="/login" style={{ display: "block", marginBottom: 10 }}>
            <button
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f33939 0%, #802222 100%)",
                border: "none",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Geist', system-ui, sans-serif",
                boxShadow: "0 4px 20px rgba(243,57,57,0.3)",
                transition: "all 0.2s ease",
              }}
            >
              Go to Login →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckInbox;
