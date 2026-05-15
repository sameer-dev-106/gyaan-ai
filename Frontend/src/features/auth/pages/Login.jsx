import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import styles from "../style/auth.module.scss";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { GoogleIcon } from "../icons/Auth.icons";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const { success, error } = await handleLogin({ email, password });
    if (!success) {
      setErrors({ form: error });
      return;
    }
    console.log("Login page:-", user)
    navigate("/");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.authPage}>
      {/* <AuthLeft /> */}

      <div className={styles.rightPanel}>
        <div className={styles.mobileLogo}></div>

        <div className={styles.formWrapper}>
          <div className={styles.heading}>
            <h1>Welcome back</h1>
            <p>Sign in to your Perplexity account</p>
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
            </div>

            {errors.form && <p className={styles.errorMsg}>{errors.form}</p>}

            <div className={styles.forgotRow}>
              <button type="button">Forgot password?</button>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className={styles.footerLink}>
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

          <p className={styles.terms}>
            By signing in, you agree to our <span>Terms of Service</span> and{" "}
            <span>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
