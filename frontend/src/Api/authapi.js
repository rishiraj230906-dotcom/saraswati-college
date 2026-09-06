import api from "./axiosConfig";

// Check whether phone number exists
export const checkPhoneExists = async (phone) => {
  const response = await api.get(`/user/check-phone/${phone}`);
  return response.data;
};

// Check whether email exists
export const checkEmailExists = async (email) => {
  const response = await api.get(`/user/check-email/${email}`);
  return response.data;
};

// Send registration OTP
export const sendRegistrationOtp = async (email) => {
  const response = await api.post("/user/send-otp", {
    email,
  });

  return response.data;
};

// Verify registration OTP
export const verifyRegistrationOtp = async (email, otp) => {
  const response = await api.post("/user/verify-otp", {
    email,
    otp,
  });

  return response.data;
};

// Register student
export const registerStudent = async (userData) => {
  const response = await api.post(
    "/user/register/student",
    userData
  );

  return response.data;
};

// Login
export const loginUser = async (email, password) => {
  const response = await api.get("/user/login", {
    params: {
      email,
      password,
    },
  });

  return response.data;
};

// Send forgot password OTP
export const sendResetOtp = async (email) => {
  const response = await api.post(
    "/user/forgot-password/send-otp",
    {
      email,
    }
  );

  return response.data;
};

// Verify forgot password OTP
export const verifyResetOtp = async (email, otp) => {
  const response = await api.post(
    "/user/forgot-password/verify-otp",
    {
      email,
      otp,
    }
  );

  return response.data;
};

// Reset password
export const resetPassword = async (email, newPassword) => {
  const response = await api.post(
    "/user/forgot-password/reset",
    {
      email,
      newPassword,
    }
  );

  return response.data;
};
