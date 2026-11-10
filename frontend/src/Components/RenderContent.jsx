import RenderLoginContent from "./RenderLoginContent";
import { useState } from "react";
import {
  validateName,
  validatePhone,
  validatePassword,
} from "../utils/validation";
import {
  checkPhoneExists,
  checkEmailExists,
  sendRegistrationOtp,
  verifyRegistrationOtp,
  registerStudent,
} from "../Api/authapi";

const RenderContent = ({ selectedTab, setSelectedTab, showNotice }) => {
  const [otpVerified, setOtpVerified] = useState(false);
  const [isChecking, setIsChecking] = useState({
    email: false,
    phone: false,
  });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    otp: "",
    password: "",
    confirmPass: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setMessage("");

    if (!validateName(form.firstName)) {
      setErrors((prev) => ({
        ...prev,
        firstName:
          "First name must contain only capital letters A-Z",
      }));
      return;
    }

    if (
      form.lastName &&
      !validateName(form.lastName)
    ) {
      setErrors((prev) => ({
        ...prev,
        lastName:
          "Last name must contain only capital letters A-Z",
      }));
      return;
    }

    if (!validatePhone(form.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be exactly 10 digits",
      }));
      return;
    }

    if (!validatePassword(form.password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must contain uppercase, lowercase & special character",
      }));
      return;
    }

    if (form.password !== form.confirmPass) {
      setErrors((prev) => ({
        ...prev,
        confirmPass: "Passwords do not match",
      }));
      return;
    }

    if (!otpVerified) {
      setMessage("Please verify OTP first");
      return;
    }

    setIsSubmitting(true);

    try {
      const phoneExists = await handleCheckPhone(form.phone);
      const emailExists = await handleCheckEmail(form.email);

      if (phoneExists || emailExists) {
        setMessage("Please fix the errors before submitting");
        return;
      }

      await registerStudent({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      console.log("User added:", form);

      setMessage("Registration successful");

      showNotice("Registration successful! Please login.", "success");

      setSelectedTab("login");
    } catch (error) {
      console.error(error);

      if (
        error.response?.data?.message?.includes("phone")
      ) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number already exists",
        }));
      } else if (
        error.response?.data?.message?.includes("email")
      ) {
        setErrors((prev) => ({
          ...prev,
          email: "Email already exists",
        }));
      }

      setMessage(
        "Registration failed: " +
          (error.response?.data?.message ||
            "Please try again")
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (e) => {
      const { name, value } = e.target;
  
      if (name === "firstName" || name === "lastName") {
        const upperValue = value.toUpperCase();
  
        if (value === "" || /^[a-zA-Z]*$/.test(value)) {
          setForm((prev) => ({
            ...prev,
            [name]: upperValue,
          }));
  
          setErrors((prev) => ({
            ...prev,
            [name]: "",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            [name]: "Only capital letters A-Z allowed",
          }));
        }
  
        return;
      }
  
      if (name === "phone") {
        const numericValue = value.replace(/\D/g, "");
  
        if (numericValue.length <= 10) {
          setForm((prev) => ({
            ...prev,
            phone: numericValue,
          }));
  
          if (numericValue.length === 10) {
            setErrors((prev) => ({
              ...prev,
              phone: "",
            }));
          } else if (numericValue.length > 0) {
            setErrors((prev) => ({
              ...prev,
              phone: "Phone number must be 10 digits",
            }));
          }
        }
  
        return;
      }
  
      if (name === "password") {
        setForm((prev) => ({
          ...prev,
          password: value,
        }));
  
        setErrors((prev) => ({
          ...prev,
          password:
            value && !validatePassword(value)
              ? "Password must contain uppercase, lowercase & special character"
              : "",
          confirmPass:
            form.confirmPass && value !== form.confirmPass
              ? "Passwords do not match"
              : "",
        }));
  
        return;
      }
  
      if (name === "confirmPass") {
        setForm((prev) => ({
          ...prev,
          confirmPass: value,
        }));
  
        setErrors((prev) => ({
          ...prev,
          confirmPass:
            value && value !== form.password
              ? "Passwords do not match"
              : "",
        }));
  
        return;
      }
  
      setForm((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "email" ? { otp: "" } : {}),
      }));
  
      if (name === "email") {
        setOtpVerified(false);
      }

      if (name === "phone" || name === "email") {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    };
  const handleCheckPhone = async (phone) => {
      if (!phone || phone.length !== 10) return false;
  
      setIsChecking((prev) => ({
        ...prev,
        phone: true,
      }));
  
      try {
        const exists = await checkPhoneExists(phone);
  
        if (exists) {
          setErrors((prev) => ({
            ...prev,
            phone: "Phone number already registered",
          }));
  
          return true;
        }
  
        return false;
      } catch (error) {
        console.error("Error checking phone:", error);
        return false;
      } finally {
        setIsChecking((prev) => ({
          ...prev,
          phone: false,
        }));
      }
    };
  const handleCheckEmail = async (email) => {
    if (!email || !email.includes("@")) return false;

    setIsChecking((prev) => ({
      ...prev,
      email: true,
    }));

    try {
      const exists = await checkEmailExists(email);

      if (exists) {
        setErrors((prev) => ({
          ...prev,
          email: "Email already registered",
        }));

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    } finally {
      setIsChecking((prev) => ({
        ...prev,
        email: false,
      }));
    }
  };
  const handleBlur = (e) => {
    const { name } = e.target;

    if (name === "phone") {
      if (form.phone.length !== 10) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number must be 10 digits",
        }));
      } else {
        handleCheckPhone(form.phone);
      }
    }

    if (name === "email") {
      handleCheckEmail(form.email);
    }
  };
  const sendOtp = async () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter a valid email address",
      }));
      return;
    }
  
    const emailExists = await handleCheckEmail(form.email);
  
    if (emailExists) {
      showNotice(
        "This email is already registered. Please use a different email or login.",
        "error"
      );
      return;
    }
  
    try {
      await sendRegistrationOtp(form.email);
      setOtpVerified(false);
      showNotice("OTP sent to email", "success");
    } catch (error) {
      console.error(error);
  
      if (error.response?.status === 409) {
        showNotice("Email already registered. Please login instead.", "error");
      } else {
        showNotice("Failed to send OTP", "error");
      }
    }
  };
  const verifyOtp = async () => {
    if (!form.email || !form.otp) {
      setMessage("Enter your email and verification code first");
      return;
    }

    try {
      await verifyRegistrationOtp(form.email, form.otp);

      showNotice("OTP verified", "success");
      setOtpVerified(true);
    } catch (error) {
      showNotice("Invalid OTP", "error");
    }
  };

  if (selectedTab === "login") {
    return (
      <RenderLoginContent showNotice={showNotice} />
    );
  }

  // Registration form
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
          {/* NAME */}
          <div className="form-row">
            <div>
              <label>First Name *</label>
              <input
                type="text"
                placeholder="Enter First name (A-Z only)"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={
                  errors.firstName
                    ? "error-input"
                    : ""
                }
                required
              />
              {errors.firstName && (
                <p className="field-error">
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter Last name (A-Z only)"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={
                  errors.lastName
                    ? "error-input"
                    : ""
                }
              />
              {errors.lastName && (
                <p className="field-error">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>
          {/* PHONE + EMAIL */}
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
                className={
                  errors.phone
                    ? "error-input"
                    : ""
                }
                required
              />
              {isChecking.phone && (
                <span className="checking">
                  Checking...
                </span>
              )}
              {errors.phone && (
                <p className="field-error">
                  {errors.phone}
                </p>
              )}
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
                  className={`
                    ${errors.email ? "error-input" : ""}
                    ${otpVerified ? "disabled-field" : ""}
                  `}
                  required
                />
                <button
                  type="button"
                  className="otp-btn"
                  onClick={sendOtp}
                  disabled={
                    !!errors.email ||
                    !form.email ||
                    otpVerified
                  }
                >
                  Send OTP
                </button>
              </div>
              {isChecking.email && (
                <span className="checking">
                  Checking...
                </span>
              )}

              {errors.email && (
                <p className="field-error">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
          {/* OTP + PASSWORD */}
          <div className="form-row">
            <div>
              <label>Verification Code *</label>
              <div className="otp-row">
                <input
                  type="text"
                  placeholder="Verification Code"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  disabled={otpVerified}
                  className={
                    otpVerified
                      ? "disabled-field"
                      : ""
                  }
                  required
                />
                <button
                  type="button"
                  className="otp-btn"
                  onClick={verifyOtp}
                  disabled={
                    !form.email ||
                    !!errors.email ||
                    otpVerified
                  }
                >
                  {otpVerified
                    ? "Verified ✓"
                    : "Verify OTP"}
                </button>
              </div>
            </div>
            <div>
              <label>Password *</label>
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={
                  errors.password
                    ? "error-input"
                    : ""
                }
                required
              />
              {errors.password && (
                <p className="field-error">
                  {errors.password}
                </p>
              )}
              <small className="password-hint">
                Must contain uppercase, lowercase &
                special character
              </small>
            </div>
          </div>
          {/* CONFIRM PASSWORD */}
          <label>Confirm Password *</label>
          <input
            type="password"
            placeholder="Confirm password"
            name="confirmPass"
            value={form.confirmPass}
            onChange={handleChange}
            className={
              errors.confirmPass
                ? "error-input"
                : ""
            }
            required
          />
          {errors.confirmPass && (
            <p className="field-error">
              {errors.confirmPass}
            </p>
          )}
          {message && (
            <p className="error-message">
              {message}
            </p>
          )}
          <button
            className="submit-btn"
            type="submit"
            disabled={
              isSubmitting ||
              !otpVerified ||
              !form.firstName ||
              !form.phone ||
              !form.email ||
              !form.password ||
              !form.confirmPass ||
              !!errors.firstName ||
              !!errors.lastName ||
              !!errors.phone ||
              !!errors.email ||
              !!errors.password ||
              !!errors.confirmPass
            }
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default RenderContent;