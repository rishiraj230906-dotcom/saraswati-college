
const Credential = () => {
  const [selectedTab, setSelectedTab] = useState("login");
  const renderLoginContent = () => {
    if (forgotPasswordMode) {
      return (
        <div className="auth-form">
          <div className="forgot-password-header">
            <button className="back-btn" onClick={handleBackToLogin}>
              <i className="fa-solid fa-arrow-left"></i> Back to Login
            </button>
            <h3>Reset Password</h3>
          </div>

          {!resetPasswordMode ? (
            // Step 1: Enter Email
            <div className="reset-password-form">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              
              {resetMessage && <p className={resetMessage.includes("sent") ? "success-message" : "error-message"}>{resetMessage}</p>}
              
              <button 
                className="submit-btn" 
                onClick={sendResetOtp}
                disabled={resetLoading || !resetEmail}
              >
                {resetLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          ) : !resetOtpVerified ? (
            // Step 2: Verify OTP
            <div className="reset-password-form">
              <p className="info-text">OTP has been sent to {resetEmail}</p>
              
              <div className="form-group">
                <label>Enter OTP *</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  maxLength="6"
                  required
                />
              </div>
              
              {resetMessage && <p className="error-message">{resetMessage}</p>}
              
              <button 
                className="submit-btn" 
                onClick={verifyResetOtp}
                disabled={resetLoading || !resetOtp}
              >
                {resetLoading ? "Verifying..." : "Verify OTP"}
              </button>
              
              <button className="resend-btn" onClick={sendResetOtp} disabled={resetLoading}>
                Resend OTP
              </button>
            </div>
          ) : (
            // Step 3: Set New Password
            <div className="reset-password-form">
              <div className="form-group">
                <label>New Password *</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <small className="password-hint">Must contain uppercase, lowercase & special character</small>
              </div>
              
              <div className="form-group">
                <label>Confirm New Password *</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              
              {resetMessage && <p className="error-message">{resetMessage}</p>}
              
              <button 
                className="submit-btn" 
                onClick={resetPassword}
                disabled={resetLoading || !newPassword || !confirmNewPassword}
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}
        </div>
      );
    }

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
              required
              onChange={handleLoginChange}
            />
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              onChange={handleLoginChange}
              required
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
            {message && <p className="error-message">{message}</p>}
            <button className="submit-btn" type="submit">Login</button>
          </form>
        </div>
      </>
    );
  };
  const renderContent = () => {
    if (selectedTab === "login") {
      return renderLoginContent();
    }

    return (
      <>
        <div className="auth-info">
          <h3>Create Account ✨</h3>
          <p>Register to get started</p>
          <ul>
            <li>Quick registration</li>
            <li>Email verification</li>
            <li>Secure access</li>
          </ul>
        </div>

        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div>
                <label>First Name *</label>
                <input
                  type="text"
                  placeholder="Enter First name (A-Z only)" 
                  name="firstname" 
                  value={form.firstname}
                  onChange={handleChange} 
                  className={errors.firstname ? "error-input" : ""}
                  required 
                />
                {errors.firstname && <p className="field-error">{errors.firstname}</p>}
              </div>
              <div>
                <label>Last Name</label>
                <input 
                  type="text" 
                  placeholder="Enter Last name (A-Z only)" 
                  name="lastname" 
                  value={form.lastname}
                  onChange={handleChange} 
                  className={errors.lastname ? "error-input" : ""}
                  required
                />
                {errors.lastname && <p className="field-error">{errors.lastname}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="input-with-validation">
                <label>Contact No. *</label>
                <input
                  type="tel"
                  placeholder="Enter 10 digit mob. no."
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="10"
                  className={errors.phone ? "error-input" : ""}
                  required 
                />
                {isChecking.phone && <span className="checking">Checking...</span>}
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>
              <div>
                <label>Email ID *</label>
                <div className="otp-row">
                  <input 
                    type="email" 
                    placeholder="Enter valid email id" 
                    name="email" 
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={otpVerified}
                    className={`${errors.email ? "error-input" : ""} ${otpVerified ? "disabled-field" : ""}`}
                    required 
                  />
                  <button 
                    type="button" 
                    className="otp-btn" 
                    onClick={sendOtp}
                    disabled={!!errors.email || !form.email || otpVerified}
                  >
                    Send OTP
                  </button>
                </div>
                {isChecking.email && <span className="checking">Checking...</span>}
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Verification Code *</label>
                <div className="otp-row">
                  <input 
                    type="text" 
                    placeholder="Verification Code" 
                    name="otp" 
                    onChange={handleChange}
                    disabled={otpVerified}
                    className={otpVerified ? "disabled-field" : ""}
                    required 
                  />
                  <button 
                    type="button" 
                    className="otp-btn" 
                    onClick={verifyOtp}
                    disabled={!form.email || !!errors.email || otpVerified}
                  >
                    {otpVerified ? "Verified ✓" : "Verify OTP"}
                  </button>
                </div>
              </div>
              <div>
                <label>Password *</label>
                <input 
                  type="password" 
                  placeholder="Enter password" 
                  name="password" 
                  onChange={handleChange} 
                  className={errors.password ? "error-input" : ""}
                  required 
                />
                {errors.password && <p className="field-error">{errors.password}</p>}
                <small className="password-hint">Must contain uppercase, lowercase & special character</small>
              </div>
            </div>

            <label>Confirm Password *</label>
            <input 
              type="password" 
              placeholder="Confirm password" 
              name="confirmPass" 
              onChange={handleChange} 
              className={errors.confirmPass ? "error-input" : ""}
              required 
            />
            {errors.confirmPass && <p className="field-error">{errors.confirmPass}</p>}

            {message && <p className="error-message">{message}</p>}
            <button 
              className="submit-btn" 
              type="submit"
              disabled={!!errors.firstname || !!errors.lastname || !!errors.phone || !!errors.email || !!errors.password || !!errors.confirmPass}
            >
              Register
            </button>
          </form>
        </div>
      </>
    );
  };
  return (
    <div className="register-page">
      <nav className="cr-navbar">
        <div className="logo-container1">
          <img src={logo} alt="logo" className="logo-image1" />
          <p>Saraswati College</p>
        </div>
      </nav>
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={selectedTab === "login" ? "active" : ""}
            onClick={() => setSelectedTab("login")}
          >
            Login
          </button>
          <button
            className={selectedTab === "register" ? "active" : ""}
            onClick={() => setSelectedTab("register")}
          >
            Register
          </button>
        </div>

        <div className="auth-body">{renderContent()}</div>
      </div>
    </div>
  );
};
export default Credential;