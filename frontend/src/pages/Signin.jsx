import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useState } from "react";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";

const Signin = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => setIsShowPassword((prev) => !prev);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!otpSent) {
      try {
        setSendingOtp(true);
        await API.post("/users/login", {
          email: formData.email,
        });
        setOtpSent(true);
      } catch (err) {
        console.error("OTP request failed", err);
        const msg =
          err?.response?.data?.message ||
          "Failed to send OTP. Please try again.";
        setOtpError(msg);
      } finally {
        setSendingOtp(false);
      }
    } else {
      try {
        setVerifying(true);
        const res = await API.post("/users/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } catch (err) {
        console.error("OTP verification failed", err);
        const msg =
          err?.response?.data?.message || "Invalid OTP. Please try again.";
        setOtpError(msg);
      } finally {
        setVerifying(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-[150px]">
        <div className="lg:absolute top-6 left-8 flex items-center gap-1 font-semibold mb-6 justify-center lg:justify-start">
          <img src="/logo.png" alt="Logo" className="w-7" />
          <p className="text-2xl">HD</p>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold mb-2">Sign in</h2>
        <p className="text-[#969696] mb-7 text-md">
          Please login to continue to your account.
        </p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative w-full">
            <label
              htmlFor="email"
              className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={otpSent}
              className="w-full border border-gray-300 rounded-lg px-4 pt-4 pb-2 text-black focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* OTP Input */}
          {otpSent && (
            <div className="w-full relative">
              <input
                type={isShowPassword ? "text" : "password"}
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-blue-600"
              />
              {isShowPassword ? (
                <FaRegEye
                  onClick={toggleShowPassword}
                  size={22}
                  className="text-gray-500 absolute top-3 right-4 cursor-pointer"
                />
              ) : (
                <FaRegEyeSlash
                  onClick={toggleShowPassword}
                  size={22}
                  className="text-gray-500 absolute top-3 right-4 cursor-pointer"
                />
              )}
            </div>
          )}

          {/* Success Message */}
          {otpSent && (
            <div className="text-sm text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded-md space-y-1">
              <p>✅ OTP has been sent to your email.</p>
              <p className="text-xs text-gray-600">
                This OTP will expire in 10 minutes.
              </p>
            </div>
          )}

          {/* Error Message */}
          {otpError && (
            <div className="text-sm text-red-700 bg-red-100 border border-red-300 px-4 py-2 rounded-md">
              {otpError}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={
              sendingOtp || verifying || (otpSent && formData.otp.length < 6)
            }
          >
            {sendingOtp
              ? "Sending OTP..."
              : verifying
              ? "Verifying..."
              : otpSent
              ? "Sign In"
              : "Get OTP"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 text-center text-sm text-gray-400">or</div>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (response) => {
              try {
                const res = await API.post("/users/google-login", {
                  credential: response.credential,
                });
                localStorage.setItem("token", res.data.token);
                window.location.href = "/";
              } catch (err) {
                alert("Google login failed");
              }
            }}
            onError={() => alert("Google login failed")}
          />
        </div>

        <p className="mt-5 text-gray-500 text-center">
          Need an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>

      {/* Right Image */}
      <div className="hidden lg:block w-1/2 h-screen p-1">
        <img
          src="/bg.png"
          alt="Right"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

export default Signin;
