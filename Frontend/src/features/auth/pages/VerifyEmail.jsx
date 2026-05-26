import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CheckCircle, XCircle, Loader2, MailX } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import styles from "../style/auth.module.scss";
import AuthLeft from "../components/AuthLeft";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { handleVerifyEmail } = useAuth();

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "failed"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("failed");
      setMessage(
        "No verification token found. Please use the link from your email.",
      );
      return;
    }

    let cancelled = false;

    (async () => {
      const result = await handleVerifyEmail(token);

      if (cancelled) return;

      if (result.success) {
        setStatus("success");
        setMessage(
          result.alreadyVerified
            ? "Your email was already verified. You can log in."
            : "Your email has been verified successfully!",
        );
      } else {
        setStatus("failed");
        setMessage(
          result.error || "The verification link is invalid or has expired.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []); // run once on mount

  return (
    <div className={styles.authPage}>
      <AuthLeft
        title="Almost there."
        subtitle="We're confirming your identity so you can start your Gyaan AI learning journey."
        features={[
          "AI-powered personalized learning",
          "Smart quizzes & instant feedback",
          "Track progress across subjects",
        ]}
      />

      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          {/* ─── LOADING STATE ─── */}
          {status === "loading" && (
            <>
              <div
                style={iconWrapperStyle(
                  "rgba(243,57,57,0.1)",
                  "rgba(243,57,57,0.2)",
                )}
              >
                <Loader2
                  size={28}
                  color="#f33939"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              </div>

              <div className={styles.heading} style={{ marginBottom: "20px" }}>
                <h1>Verifying your email…</h1>
                <p>Please wait while we confirm your address.</p>
              </div>

              {/* Animated dots progress bar */}
              <div style={progressBarContainer}>
                <div style={progressBarFill} />
              </div>

              <style>{`
                @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
                @keyframes shimmer {
                  0%   { transform: translateX(-100%) }
                  100% { transform: translateX(250%) }
                }
              `}</style>
            </>
          )}

          {/* ─── SUCCESS STATE ─── */}
          {status === "success" && (
            <>
              <div
                style={iconWrapperStyle(
                  "rgba(34,197,94,0.1)",
                  "rgba(34,197,94,0.2)",
                )}
              >
                <CheckCircle size={28} color="#22c55e" />
              </div>

              <div className={styles.heading} style={{ marginBottom: "20px" }}>
                <h1 style={{ color: "#22c55e" }}>Email Verified!</h1>
                <p>{message}</p>
              </div>

              {/* Success info card */}
              <div
                style={infoCard("rgba(34,197,94,0.05)", "rgba(34,197,94,0.15)")}
              >
                {[
                  "Your account is now fully active",
                  "You can log in with your credentials",
                  "Start your personalized learning journey",
                ].map((item, i) => (
                  <div key={i} style={infoRow(i < 2)}>
                    <span
                      style={checkDot(
                        "#22c55e",
                        "rgba(34,197,94,0.15)",
                        "rgba(34,197,94,0.3)",
                      )}
                    >
                      ✓
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "14px",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/login" style={{ display: "block", marginTop: "24px" }}>
                <button
                  style={primaryBtn(
                    "#22c55e",
                    "rgba(34,197,94,0.15)",
                    "rgba(34,197,94,0.3)",
                  )}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(34,197,94,0.25)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(34,197,94,0.15)")
                  }
                >
                  Go to Login →
                </button>
              </Link>
            </>
          )}

          {/* ─── FAILED STATE ─── */}
          {status === "failed" && (
            <>
              <div
                style={iconWrapperStyle(
                  "rgba(243,57,57,0.1)",
                  "rgba(243,57,57,0.2)",
                )}
              >
                <MailX size={28} color="#f33939" />
              </div>

              <div className={styles.heading} style={{ marginBottom: "20px" }}>
                <h1 style={{ color: "#f33939" }}>Verification Failed</h1>
                <p>{message}</p>
              </div>

              {/* Error hints card */}
              <div
                style={infoCard("rgba(243,57,57,0.04)", "rgba(243,57,57,0.12)")}
              >
                {[
                  "The link may have expired (valid for 24 hours)",
                  "Make sure you used the latest email we sent",
                  "Check your spam / junk folder",
                ].map((item, i) => (
                  <div key={i} style={infoRow(i < 2)}>
                    <span
                      style={checkDot(
                        "#f33939",
                        "rgba(243,57,57,0.15)",
                        "rgba(243,57,57,0.3)",
                      )}
                    >
                      !
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "14px",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <Link to="/register" style={{ flex: 1 }}>
                  <button
                    style={primaryBtn(
                      "#f33939",
                      "rgba(243,57,57,0.15)",
                      "rgba(243,57,57,0.3)",
                    )}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(243,57,57,0.25)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(243,57,57,0.15)")
                    }
                  >
                    Register Again
                  </button>
                </Link>
                <Link to="/login" style={{ flex: 1 }}>
                  <button
                    style={ghostBtn}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.03)")
                    }
                  >
                    Go to Login
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Shared inline style helpers ────────────────────────────────────────────

const iconWrapperStyle = (bg, border) => ({
  width: 64,
  height: 64,
  borderRadius: "16px",
  background: bg,
  border: `1px solid ${border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "28px",
});

const infoCard = (bg, border) => ({
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: "12px",
  padding: "20px",
});

const infoRow = (hasDivider) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 0",
  borderBottom: hasDivider ? "1px solid rgba(255,255,255,0.05)" : "none",
});

const checkDot = (color, bg, border) => ({
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: bg,
  border: `1px solid ${border}`,
  color,
  fontSize: "11px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const primaryBtn = (color, bg, border) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  background: bg,
  border: `1px solid ${border}`,
  color,
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontFamily: "'Geist', system-ui, sans-serif",
});

const ghostBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.5)",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontFamily: "'Geist', system-ui, sans-serif",
};

const progressBarContainer = {
  width: "100%",
  height: "3px",
  background: "rgba(255,255,255,0.06)",
  borderRadius: "99px",
  overflow: "hidden",
  marginTop: "8px",
  position: "relative",
};

const progressBarFill = {
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "40%",
  background: "linear-gradient(90deg, transparent, #f33939, transparent)",
  animation: "shimmer 1.5s infinite",
  borderRadius: "99px",
};

export default VerifyEmail;
