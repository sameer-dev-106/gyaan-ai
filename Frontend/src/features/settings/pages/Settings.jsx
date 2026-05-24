import React, { useState } from "react";
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
} from "lucide-react";
import {
  updateProfileApi,
  changePasswordApi,
  logoutApi,
} from "../../auth/services/auth.api";
import { setUser, updateUsername } from "../../auth/auth.slice";
import "../style/settings.scss";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Profile edit state
  const [username, setUsername] = useState(user?.username || "");
  const [profileStatus, setProfileStatus] = useState(null); // null | "success" | "error"
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const tokensUsed = user?.tokensUsed ?? 0;
  const tokenLimit = user?.tokenLimit ?? 50000;
  const tokenPercent = Math.min(
    Math.round((tokensUsed / tokenLimit) * 100),
    100,
  );
  const plan = user?.plan || "free";

  // Reset time
  const lastReset = user?.lastTokenReset ? new Date(user.lastTokenReset) : null;
  const nextReset = lastReset
    ? new Date(lastReset.getTime() + 24 * 60 * 60 * 1000)
    : null;
  const timeUntilReset = nextReset
    ? Math.max(0, Math.ceil((nextReset - Date.now()) / (1000 * 60 * 60)))
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
    } catch (err) {
      setPasswordStatus("error");
      setPasswordMsg(
        typeof err === "string" ? err : "Failed to change password",
      );
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
      {/* Header */}
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
        {/* ── Token Usage Card ─────────────────────── */}
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
              <span className="token-limit">
                {tokenLimit.toLocaleString()} tokens
              </span>
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

        {/* ── Profile Card ─────────────────────────── */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <User size={18} />
            </div>
            <div>
              <h2>Profile</h2>
              <p className="card-subtitle">{user?.email}</p>
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              maxLength={30}
            />
          </div>

          {profileStatus && (
            <div className={`status-msg ${profileStatus}`}>
              {profileStatus === "success" ? (
                <Check size={14} />
              ) : (
                <X size={14} />
              )}
              {profileMsg}
            </div>
          )}

          <button
            className="save-btn"
            onClick={handleProfileSave}
            disabled={
              profileLoading ||
              !username.trim() ||
              username.trim() === user?.username
            }
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* ── Password Card ────────────────────────── */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <Lock size={18} />
            </div>
            <div>
              <h2>Change Password</h2>
              <p className="card-subtitle">Keep your account secure</p>
            </div>
            <button
              className="toggle-pass-btn"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? "Hide" : "Show"}
            </button>
          </div>

          <div className="form-group">
            <label>Current Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
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
              {passwordStatus === "success" ? (
                <Check size={14} />
              ) : (
                <X size={14} />
              )}
              {passwordMsg}
            </div>
          )}

          <button
            className="save-btn"
            onClick={handlePasswordChange}
            disabled={passwordLoading}
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </div>

        {/* ── Logout ───────────────────────────────── */}
        <div className="settings-card danger-card">
          <div className="card-header">
            <div className="card-icon danger-icon">
              <LogOut size={18} />
            </div>
            <div>
              <h2>Sign Out</h2>
              <p className="card-subtitle">Log out of your account</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
