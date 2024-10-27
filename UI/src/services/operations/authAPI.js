import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import {
  setLoading,
  setToken,
} from "../../redux/slices/authSlice";
import {
  setUser,
} from "../../redux/slices/profileSlice";
import { endpoints } from "../apis";
import { showCustomToast } from "../../utils/CustomToast";

const {
  LOGIN_API,
  REGISTER_API,
  FORGOT_PASSWORD_API,
  RESET_PASSWORD_API,
  EMAIL_VERIFICATION_API,
} = endpoints;

export function login(emailOrMobile, password, rememberMe, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        emailOrMobile,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userData = response.data.data;

      showCustomToast("Login Successful");
      dispatch(setToken(userData.token));

      const userImage = userData.image
        ? userData.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${userData.name}`;

      dispatch(setUser({ ...userData, image: userImage }));

      // Store data in localStorage as JSON strings
      localStorage.setItem("token", JSON.stringify(userData.token));
      localStorage.setItem("name", JSON.stringify(userData.name));
      localStorage.setItem("userId", JSON.stringify(userData.id));
      localStorage.setItem("roleId", JSON.stringify(userData.roleId));
      localStorage.setItem("branchId", JSON.stringify(userData.branchId));
      localStorage.setItem("instituteId", JSON.stringify(userData.instituteId));

      // Store credentials if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberMeEmailOrMobile", emailOrMobile);
        localStorage.setItem("rememberMePassword", password);
      } else {
        localStorage.removeItem("rememberMeEmailOrMobile");
        localStorage.removeItem("rememberMePassword");
      }

      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      dispatch(setLoading(false));
      toast.dismiss(toastId);
      throw error;
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function register(formData, ipAddr, browserInfo, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    console.log("FormDataaaaaaaaa=======",formData);
    try {
      const response = await apiConnector("POST", REGISTER_API, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        ipAddr,
        browserInfo,
      });
      console.log("Responseeeeeeeeeeeee===========",response.status.statusText);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      

      // toast.success("Register Successful. Please verify email.");
      showCustomToast("Register Successful. Please verify email.");
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.clear();
    sessionStorage.clear();
    // toast.success("Logged Out");
    showCustomToast("Logged Out");
    navigate("/");
  };
}

export function forgotPassword(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", FORGOT_PASSWORD_API, {
        email,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // console.log(response.data.data);

      // toast.success("Link Sent");
      showCustomToast("Link has been sent on registered email");
      navigate("/");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "PUT",
        `${RESET_PASSWORD_API}?token=${token}`,
        {
          password,
          confirmPassword,
          token,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // console.log(response.data.data);

      // toast.success("Register Successful");
      showCustomToast("Password is reset successfully");
      navigate("/");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function verifyEmail(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        `${EMAIL_VERIFICATION_API}/${email}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // console.log(response.data.data);

      // toast.success("Link Sent");
      showCustomToast("Link has been sent on registered email");
      navigate("/");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
