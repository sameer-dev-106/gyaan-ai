import React, { useState } from "react";
import { useNavigate } from "react-router";
// import { useDispatch, useSelector } from "react-redux";
import { UserCircle2, MapPin, Briefcase, Calendar, ArrowRight, Sparkles } from "lucide-react";
import styles from "../style/auth.module.scss";
import { updatePreferencesApi } from "../../settings/services/memory.api";

const CompleteProfile = () => {
  const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    fullName: "",
    profession: "",
    location: "",
    dateOfBirth: "",
    language: "english",
    responseStyle: "friendly",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const interests = form.interests
        ? form.interests.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      await updatePreferencesApi({ ...form, interests });
      navigate("/");
    } catch (err) {
      setError(typeof err === "string" ? err : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authPage} style={{ alignItems: "center", justifyContent: "center" }}>
      <div className={styles.rightPanel} style={{ maxWidth: 480, width: "100%" }}>
        <div className={styles.formWrapper}>
          {/* Header */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "14px",
              background: "rgba(243,57,57,0.1)",
              border: "1px solid rgba(243,57,57,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Sparkles size={24} color="#f33939" />
          </div>

          <div className={styles.heading}>
            <h1>Complete your profile</h1>
            <p>Help Gyaan AI personalize your experience</p>
          </div>

          <div className="cp-fields" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            {/* Full Name */}
            <div className={styles.field}>
              <label>
                <UserCircle2 size={12} style={{ marginRight: 5, verticalAlign: "middle" }} />
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sameer Lilar"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                maxLength={50}
              />
            </div>

            {/* Date of Birth */}
            <div className={styles.field}>
              <label>
                <Calendar size={12} style={{ marginRight: 5, verticalAlign: "middle" }} />
                Date of Birth
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                style={{ colorScheme: "dark" }}
              />
            </div>

            {/* Profession */}
            <div className={styles.field}>
              <label>
                <Briefcase size={12} style={{ marginRight: 5, verticalAlign: "middle" }} />
                Profession / Role
              </label>
              <input
                type="text"
                placeholder="e.g. CS Student, Software Engineer"
                value={form.profession}
                onChange={(e) => handleChange("profession", e.target.value)}
                maxLength={60}
              />
            </div>

            {/* Location */}
            <div className={styles.field}>
              <label>
                <MapPin size={12} style={{ marginRight: 5, verticalAlign: "middle" }} />
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Abohar, Punjab"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                maxLength={60}
              />
            </div>

            {/* Language + Style row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className={styles.field}>
                <label>Language</label>
                <select
                  value={form.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  className={styles.select}
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="hinglish">Hinglish</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>AI Style</label>
                <select
                  value={form.responseStyle}
                  onChange={(e) => handleChange("responseStyle", e.target.value)}
                  className={styles.select}
                >
                  <option value="friendly">Friendly</option>
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
            </div>

            {/* Interests */}
            <div className={styles.field}>
              <label>Interests (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Python, AI, Music, Gaming"
                value={form.interests}
                onChange={(e) => handleChange("interests", e.target.value)}
                maxLength={200}
              />
            </div>
          </div>

          {error && (
            <p style={{ fontSize: 13, color: "#ef4444", marginTop: 12, textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            className={styles.submitBtn}
            style={{ marginTop: 20 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><span className={styles.spinner} /> Setting up...</>
            ) : (
              <>Let's Go <ArrowRight size={15} /></>
            )}
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: 12,
              background: "none",
              border: "none",
              color: "rgba(239,158,158,0.4)",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'Geist', system-ui, sans-serif",
              width: "100%",
              textAlign: "center",
            }}
          >
            Skip for now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
