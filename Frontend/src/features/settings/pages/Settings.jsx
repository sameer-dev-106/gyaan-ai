import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  User,
  Lock,
  LogOut,
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Brain,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import {
  updateProfileApi,
  changePasswordApi,
  logoutApi,
} from "../../auth/services/auth.api";
import { setUser, updateUsername } from "../../auth/auth.slice";
import {
  getMemoryApi,
  updatePreferencesApi,
  clearFactsApi,
} from "../services/memory.api";
import "../style/settings.scss";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [editingProfile, setEditingProfile] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [profileStatus, setProfileStatus] = useState(null);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [memory, setMemory] = useState(null);
  const [memoryLoading, setMemoryLoading] = useState(true);
  const [memoryStatus, setMemoryStatus] = useState(null);
  const [memoryMsg, setMemoryMsg] = useState("");
  const [prefLoading, setPrefLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [showFacts, setShowFacts] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [editingMemory, setEditingMemory] = useState(false);

  const [prefForm, setPrefForm] = useState({
    fullName: "",
    dateOfBirth: "",
    profession: "",
    location: "",
    language: "english",
    responseStyle: "friendly",
    interests: "",
  });

  useEffect(() => {
    async function fetchMemory() {
      try {
        const res = await getMemoryApi();
        const mem = res.data.memory;
        setMemory(mem);
        setPrefForm({
          fullName: mem.preferences?.fullName || "",
          dateOfBirth: mem.preferences?.dateOfBirth || "",
          profession: mem.preferences?.profession || "",
          location: mem.preferences?.location || "",
          language: mem.preferences?.language || "english",
          responseStyle: mem.preferences?.responseStyle || "friendly",
          interests: mem.preferences?.interests?.join(", ") || "",
        });
      } catch {
        // silently fail
      } finally {
        setMemoryLoading(false);
      }
    }
    fetchMemory();
  }, []);

  async function handleSavePreferences() {
    setPrefLoading(true);
    setMemoryStatus(null);
    try {
      const interests = prefForm.interests
        ? prefForm.interests.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const res = await updatePreferencesApi({ ...prefForm, interests });
      setMemory(res.data.memory);
      setMemoryStatus("success");
      setMemoryMsg("Preferences saved!");
      setEditingMemory(false);
    } catch (err) {
      setMemoryStatus("error");
      setMemoryMsg(typeof err === "string" ? err : "Failed to save");
    } finally {
      setPrefLoading(false);
      setTimeout(() => setMemoryStatus(null), 3000);
    }
  }

  async function handleClearFacts() {
    setClearLoading(true);
    try {
      const res = await clearFactsApi();
      setMemory(res.data.memory);
      setShowClearConfirm(false);
      setMemoryStatus("success");
      setMemoryMsg("AI memory cleared!");
    } catch (err) {
      setMemoryStatus("error");
      setMemoryMsg(typeof err === "string" ? err : "Failed to clear");
    } finally {
      setClearLoading(false);
      setTimeout(() => setMemoryStatus(null), 3000);
    }
  }

  const tokensUsed = user?.tokensUsed ?? 0;
  const tokenLimit = user?.tokenLimit ?? 5000;
  const tokenPercent = Math.min(Math.round((tokensUsed / tokenLimit) * 100), 100);
  const plan = user?.plan || "free";

  const lastReset = user?.lastTokenReset ? new Date(user.lastTokenReset) : null;
  const nextReset = lastReset ? new Date(lastReset.getTime() + 24 * 60 * 60 * 1000) : null;
  const timeUntilReset = nextReset
    ? // eslint-disable-next-line react-hooks/purity
      Math.max(0, Math.ceil((nextReset - Date.now()) / (1000 * 60 * 60)))
    : null;

  async function handleProfileSave() {
    if (!username.trim() || username.trim() === user?.username) return;
    setProfileLoading(true);
    setProfileStatus(null);
    try {
      await updateProfileApi({ username: username.trim() });
      dispatch(updateUsername(username.trim()));
      setProfileStatus("success");
      setProfileMsg("Username updated!");
      setEditingProfile(false);
    } catch (err) {
      setProfileStatus("error");
      setProfileMsg(typeof err === "string" ? err : "Failed to update");
    } finally {
      setProfileLoading(false);
      setTimeout(() => setProfileStatus(null), 3000);
    }
  }

  async function handlePasswordChange() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus("error");
      setPasswordMsg("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus("error");
      setPasswordMsg("New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus("error");
      setPasswordMsg("New password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    setPasswordStatus(null);
    try {
      await changePasswordApi({ currentPassword, newPassword });
      setPasswordStatus("success");
      setPasswordMsg("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditingPassword(false);
    } catch (err) {
      setPasswordStatus("error");
      setPasswordMsg(typeof err === "string" ? err : "Failed to change password");
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setPasswordStatus(null), 3000);
    }
  }

  async function handleLogout() {
    try {
      await logoutApi();
      dispatch(setUser(null));
      navigate("/login");
    } catch {
      navigate("/login");
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="settings-title">
          <Sparkles size={18} />
          <h1>Settings</h1>
        </div>
      </div>

      <div className="settings-content">

        {/* ── Daily Usage ── */}
        <div className="settings-card token-card">
          <div className="card-header">
            <div className="card-icon token-icon">⚡</div>
            <div>
              <h2>Daily Usage</h2>
              <p className="card-subtitle">Resets every 24 hours</p>
            </div>
            <span className={`plan-badge ${plan}`}>
              {plan === "pro" ? "⭐ Pro" : "Free"}
            </span>
          </div>
          <div className="token-stats">
            <div className="token-numbers">
              <span className="tokens-used">{tokensUsed.toLocaleString()}</span>
              <span className="token-sep">/</span>
              <span className="token-limit">{tokenLimit.toLocaleString()} tokens</span>
            </div>
            <span className="token-pct">{tokenPercent}%</span>
          </div>
          <div className="token-bar-wrapper">
            <div
              className={`token-bar-fill ${tokenPercent >= 90 ? "danger" : tokenPercent >= 70 ? "warning" : ""}`}
              style={{ width: `${tokenPercent}%` }}
            />
          </div>
          {timeUntilReset !== null && (
            <p className="reset-hint">
              {tokenPercent >= 100
                ? `Limit reached. Resets in ~${timeUntilReset}h`
                : `Resets in ~${timeUntilReset}h`}
            </p>
          )}
        </div>

        {/* ── Profile ── */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <User size={18} />
            </div>
            <div>
              <h2>Profile</h2>
              <p className="card-subtitle">{user?.email}</p>
            </div>
            {!editingProfile && (
              <button className="edit-btn" onClick={() => setEditingProfile(true)}>
                <Pencil size={13} /> Edit
              </button>
            )}
          </div>

          {editingProfile ? (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  maxLength={30}
                  autoFocus
                />
              </div>
              {profileStatus && (
                <div className={`status-msg ${profileStatus}`}>
                  {profileStatus === "success" ? <Check size={14} /> : <X size={14} />}
                  {profileMsg}
                </div>
              )}
              <div className="action-row">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setEditingProfile(false);
                    setUsername(user?.username || "");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="save-btn-sm"
                  onClick={handleProfileSave}
                  disabled={profileLoading || !username.trim() || username.trim() === user?.username}
                >
                  {profileLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <div className="info-row">
              <span className="info-label">Username</span>
              <span className="info-value">@{user?.username}</span>
            </div>
          )}

          {profileStatus && !editingProfile && (
            <div className={`status-msg ${profileStatus}`} style={{ marginTop: 10 }}>
              {profileStatus === "success" ? <Check size={14} /> : <X size={14} />}
              {profileMsg}
            </div>
          )}
        </div>

        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <Lock size={18} />
            </div>
            <div>
              <h2>Password</h2>
              <p className="card-subtitle">Keep your account secure</p>
            </div>
            {!editingPassword && (
              <button className="edit-btn" onClick={() => setEditingPassword(true)}>
                <Pencil size={13} /> Change
              </button>
            )}
          </div>

          {editingPassword ? (
            <>
              <div className="show-pass-toggle">
                <button
                  className="toggle-pass-btn"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? "Hide passwords" : "Show passwords"}
                </button>
              </div>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              {passwordStatus && (
                <div className={`status-msg ${passwordStatus}`}>
                  {passwordStatus === "success" ? <Check size={14} /> : <X size={14} />}
                  {passwordMsg}
                </div>
              )}
              <div className="action-row">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setEditingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="save-btn-sm"
                  onClick={handlePasswordChange}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Changing..." : "Update"}
                </button>
              </div>
            </>
          ) : (
            <div className="info-row">
              <span className="info-label">Password</span>
              <span className="info-value">••••••••</span>
            </div>
          )}
        </div>

        <div className="settings-card memory-card">
          <div className="card-header">
            <div className="card-icon memory-icon">
              <Brain size={18} />
            </div>
            <div>
              <h2>Personal Data</h2>
              <p className="card-subtitle">Personalize how Gyaan AI knows you</p>
            </div>
            {!editingMemory && !memoryLoading && (
              <button className="edit-btn" onClick={() => setEditingMemory(true)}>
                <Pencil size={13} /> Edit
              </button>
            )}
          </div>

          {memoryLoading ? (
            <div className="memory-loading">Loading...</div>
          ) : editingMemory ? (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={prefForm.fullName}
                  onChange={(e) => setPrefForm({ ...prefForm, fullName: e.target.value })}
                  placeholder="e.g. Sameer Lilar"
                  maxLength={50}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={prefForm.dateOfBirth}
                  onChange={(e) => setPrefForm({ ...prefForm, dateOfBirth: e.target.value })}
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div className="form-group">
                <label>Profession / Role</label>
                <input
                  type="text"
                  value={prefForm.profession}
                  onChange={(e) => setPrefForm({ ...prefForm, profession: e.target.value })}
                  placeholder="e.g. CS Student, Software Engineer"
                  maxLength={60}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={prefForm.location}
                  onChange={(e) => setPrefForm({ ...prefForm, location: e.target.value })}
                  placeholder="e.g. Abohar, Punjab"
                  maxLength={60}
                />
              </div>
              <div className="pref-row">
                <div className="form-group">
                  <label>Preferred Language</label>
                  <select
                    value={prefForm.language}
                    onChange={(e) => setPrefForm({ ...prefForm, language: e.target.value })}
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="hinglish">Hinglish</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Response Style</label>
                  <select
                    value={prefForm.responseStyle}
                    onChange={(e) => setPrefForm({ ...prefForm, responseStyle: e.target.value })}
                  >
                    <option value="friendly">Friendly</option>
                    <option value="concise">Concise</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Interests (comma separated)</label>
                <input
                  type="text"
                  value={prefForm.interests}
                  onChange={(e) => setPrefForm({ ...prefForm, interests: e.target.value })}
                  placeholder="e.g. Python, AI, Music"
                  maxLength={200}
                />
              </div>
              {memoryStatus && (
                <div className={`status-msg ${memoryStatus}`}>
                  {memoryStatus === "success" ? <Check size={14} /> : <X size={14} />}
                  {memoryMsg}
                </div>
              )}
              <div className="action-row">
                <button className="cancel-btn" onClick={() => setEditingMemory(false)}>
                  Cancel
                </button>
                <button
                  className="save-btn-sm"
                  onClick={handleSavePreferences}
                  disabled={prefLoading}
                >
                  {prefLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <div className="personal-data-view">
              {[
                { label: "Full Name", value: prefForm.fullName },
                { label: "Date of Birth", value: prefForm.dateOfBirth },
                { label: "Profession", value: prefForm.profession },
                { label: "Location", value: prefForm.location },
                { label: "Language", value: prefForm.language },
                { label: "Response Style", value: prefForm.responseStyle },
                { label: "Interests", value: prefForm.interests },
              ].map(({ label, value }) => (
                <div className="info-row" key={label}>
                  <span className="info-label">{label}</span>
                  <span className="info-value">{value || <span className="info-empty">Not set</span>}</span>
                </div>
              ))}
            </div>
          )}

          {!editingMemory && memory?.facts?.length > 0 && (
            <div className="facts-section">
              <button className="facts-toggle" onClick={() => setShowFacts(!showFacts)}>
                <span>🧠 AI learned {memory.facts.length} fact{memory.facts.length !== 1 ? "s" : ""} about you</span>
                {showFacts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showFacts && (
                <div className="facts-list">
                  {memory.facts.map((fact, i) => (
                    <div key={i} className="fact-item">
                      <span className="fact-key">{fact.key}</span>
                      <span className="fact-value">{fact.value}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="clear-facts-area">
                {!showClearConfirm ? (
                  <button className="clear-facts-btn" onClick={() => setShowClearConfirm(true)}>
                    <Trash2 size={13} /> Clear AI Memory
                  </button>
                ) : (
                  <div className="clear-confirm">
                    <span>Sure? This will erase all learned facts.</span>
                    <div className="confirm-btns">
                      <button className="confirm-yes" onClick={handleClearFacts} disabled={clearLoading}>
                        {clearLoading ? "Clearing..." : "Yes, Clear"}
                      </button>
                      <button className="confirm-no" onClick={() => setShowClearConfirm(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button className="logout-floating-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Sign Out
        </button>

      </div>
    </div>
  );
};

export default Settings;
