import { useState } from "react";
import { sendResetOtp, verifyResetOtp, resetPassword,loginUser } from "../Api/authapi";
import { validatePassword } from "../utils/validation";
import { useNavigate } from "react-router-dom";
const RenderLoginContent = ({}) => {
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetOtpVerified, setResetOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleLoginChange = (e) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleForgotPassword = () => {
    setForgotPasswordMode(true);
    setResetPasswordMode(false);
    setResetMessage("");
  };
  const handleBackToLogin = () => {
    setForgotPasswordMode(false);
    setResetPasswordMode(false);
    setResetEmail("");
    setResetOtp("");
    setResetOtpVerified(false);
    setNewPassword("");
    setConfirmNewPassword("");
    setResetMessage("");
  };
  const sendOtptoreset = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter your email");
      return;
    }
    setResetLoading(true);
    try {
      await sendResetOtp(resetEmail);
      setResetMessage("OTP sent to your email");
      setResetPasswordMode(true);
    } catch (error) {
      console.error("Error sending reset OTP:", error);

      if (error.response?.status === 404) {
        setResetMessage("Email not registered");
      } else {
        setResetMessage("Failed to send OTP. Please try again.");
      }
    } finally {
      setResetLoading(false);
    }
  };
  const verifyOtptoreset = async () => {
      if (!resetOtp) {
        setResetMessage("Please enter OTP");
        return;
      }
  
      setResetLoading(true);
  
      try {
        await verifyResetOtp(resetEmail, resetOtp);
  
        setResetOtpVerified(true);
        setResetMessage(
          "OTP verified. Please set your new password."
        );
      } catch (error) {
        console.error("Error verifying reset OTP:", error);
        setResetMessage("Invalid OTP");
      } finally {
        setResetLoading(false);
      }
  };
  const rPassword = async () => {
      if (!validatePassword(newPassword)) {
        setResetMessage(
          "Password must contain uppercase, lowercase & special character"
        );
        return;
      }
  
      if (newPassword !== confirmNewPassword) {
        setResetMessage("Passwords do not match");
        return;
      }
  
      setResetLoading(true);
  
      try {
        await resetPassword(resetEmail, newPassword);
  
        alert(
          "Password reset successfully! Please login with your new password."
        );
  
        handleBackToLogin();
      } catch (error) {
        console.error("Error resetting password:", error);
        setResetMessage(
          "Failed to reset password. Please try again."
        );
      } finally {
        setResetLoading(false);
      }
    };
  const handleLoginSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const res = await loginUser(
          loginForm.email,
          loginForm.password
        );
  
        sessionStorage.setItem(
          "user",
          JSON.stringify(res.data)
        );
  
        console.log("Login response:", res.data);
  
        alert("Login successful!");
  
        if (res.data.role === "STUDENT") {
          navigate("/dashboard");
        } else {
          navigate("/Admindashboard");
        }
      } catch (error) {
        console.error(error);
  
        if (error.response?.status === 401) {
          setMessage("Invalid email or password");
        } else {
          setMessage("Login failed");
        }
      }
    };

  if (forgotPasswordMode) {
    return (
      <div className="auth-form">
        <div className="forgot-password-header">
          <button
            className="back-btn"
            onClick={handleBackToLogin}
          >
            <i className="fa-solid fa-arrow-left"></i>
            {" "}Back to Login
          </button>
          <h3>Reset Password</h3>
        </div>
        {!resetPasswordMode ? (
          // STEP 1
          <div className="reset-password-form">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={resetEmail}
                onChange={(e) =>
                  setResetEmail(e.target.value)
                }
                required
              />
            </div>
            {resetMessage && (
              <p
                className={
                  resetMessage.includes("sent")
                    ? "success-message"
                    : "error-message"
                }
              >
                {resetMessage}
              </p>
            )}
            <button
              className="submit-btn"
              onClick={sendOtptoreset}
              disabled={
                resetLoading || !resetEmail
              }
            >
              {resetLoading
                ? "Sending..."
                : "Send OTP"}
            </button>
          </div>

        ) : !resetOtpVerified ? (
          // STEP 2
          <div className="reset-password-form">
            <p className="info-text">
              OTP has been sent to {resetEmail}
            </p>
            <div className="form-group">
              <label>Enter OTP *</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={resetOtp}
                onChange={(e) =>
                  setResetOtp(e.target.value)
                }
                maxLength="6"
                required
              />
            </div>
            {resetMessage && (
              <p className="error-message">
                {resetMessage}
              </p>
            )}
            <button
              className="submit-btn"
              onClick={verifyOtptoreset}
              disabled={
                resetLoading || !resetOtp
              }
            >
              {resetLoading
                ? "Verifying..."
                : "Verify OTP"}
            </button>
            <button
              className="resend-btn"
              onClick={sendOtptoreset}
              disabled={resetLoading}
            >
              Resend OTP
            </button>
          </div>

        ) : (
          // STEP 3
          <div className="reset-password-form">
            <div className="form-group">
              <label>New Password *</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
              />
              <small className="password-hint">
                Must contain uppercase, lowercase &
                special character
              </small>
            </div>
            <div className="form-group">
              <label>
                Confirm New Password *
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) =>
                  setConfirmNewPassword(e.target.value)
                }
                required
              />
            </div>
            {resetMessage && (
              <p className="error-message">
                {resetMessage}
              </p>
            )}
            <button
              className="submit-btn"
              onClick={rPassword}
              disabled={
                resetLoading ||
                !newPassword ||
                !confirmNewPassword
              }
            >
              {resetLoading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // LOGIN
  return (
    <>
      <div className="auth-info">
        <h3>Welcome Back 👋</h3>
        <p>Please login to continue</p>
        <ul>
          <li>Access your dashboard</li>
          <li>Manage courses & profile</li>
          <li>Secure & fast login</li>
        </ul>
      </div>
      <div className="auth-form">
        <form onSubmit={handleLoginSubmit}>
          <label>Email *</label>
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={loginForm.email}
            required
            onChange={handleLoginChange}
          />
          <label>Password *</label>
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            value={loginForm.password}
            required
            onChange={handleLoginChange}
          />
          <div className="forgot-password-link">
            <button
              type="button"
              className="forgot-password-btn"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
          {message && (
            <p className="error-message">
              {message}
            </p>
          )}
          <button
            className="submit-btn"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default RenderLoginContent;