import React, { useState } from "react";
import styles from "../style/auth.module.scss";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { GoogleIcon } from "../icons/Auth.icons";
import { getPasswordStrength } from "../utils/auth.utils";
import AuthLeft from "../components/AuthLeft";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.auth.loading);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const { success, error } = await handleRegister(username, email, password);
    if (!success) {
      setErrors({ form: error });
      return;
    }

    navigate("/login");
  };

  return (
    <div className={styles.authPage}>
      <AuthLeft
        title="Your AI learning journey starts here."
        subtitle="Join thousands of students using Gyaan AI to master any subject — faster, smarter, and with confidence."
        features={[
          "Personalized study plans",
          "AI-powered explanations on demand",
          "Progress insights & achievements",
        ]}
      />

      <div className={styles.rightPanel}>
        <div className={styles.mobileLogo}></div>

        <div className={styles.formWrapper}>
          <div className={styles.heading}>
            <h1>Create your account</h1>
            <p>Join our community today</p>
          </div>

          <div className={styles.oauthRow}>
            <button
              className={styles.googleBtn}
              // onClick={() => redirectToOAuth("google")}
              type="button"
            >
              <GoogleIcon /> Google
            </button>
          </div>

          <div className={styles.divider}>
            <span>or continue with email</span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Username</label>
              <input
                type="text"
                placeholder="Your name"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {password.length > 0 && (
                <>
                  <div className={styles.strengthBar}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`${styles.bar} ${i <= strength.level ? styles[strength.cls] : ""}`}
                      />
                    ))}
                  </div>
                  <span
                    className={`${styles.strengthLabel} ${styles[strength.cls]}`}
                  >
                    {strength.label}
                  </span>
                </>
              )}
            </div>

            {errors.form && <p className={styles.errorMsg}>{errors.form}</p>}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} /> Creating account...
                </>
              ) : (
                <>
                  Start Creating <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className={styles.footerLink}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <p className={styles.terms}>
            By signing up, you agree to our <span>Terms of Service</span> and{" "}
            <span>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
