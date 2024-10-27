const BASE_URL = process.env.REACT_APP_BASE_URL
// const JAVA_BASE_URL = process.env.REACT_APP_BASE_URL

// AUTH ENDPOINTS
export const endpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  REGISTER_API: BASE_URL + "/auth/signup",
  // REGISTER_API: JAVA_BASE_URL + "/auth/signup",
  FORGOT_PASSWORD_API: BASE_URL + "/auth/forgot-password",
  RESET_PASSWORD_API: BASE_URL + "/auth/reset-password",
  EMAIL_VERIFICATION_API: BASE_URL + "/auth/send-email-verification",
}

// INSTITUTES ENDPOINTS
export const institutesEndpoints = {
  CREATE_INSTITUTE: "/institute",
  REGISTER_API: BASE_URL + "/user/register",
  UPDATE_INSTITUTE: BASE_URL + "/institute",
}