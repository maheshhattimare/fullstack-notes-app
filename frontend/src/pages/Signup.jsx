import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useState } from "react";
import API from "../services/api";

import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => setIsShowPassword((prev) => !prev);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError(false);

    if (!otpSent) {
      // First step: send OTP
      try {
        setSendingOtp(true);
        const res = await API.post("/users/signup", {
          fullName: formData.fullName,
          dob: formData.dob,
          email: formData.email,
        });
        setOtpSent(true);
      } catch (err) {
        console.error("OTP request failed", err);
        setOtpError(true);
      } finally {
        setSendingOtp(false);
      }
    } else {
      // Second step: verify OTP
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
        setOtpError(true);
      } finally {
        setVerifying(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-[150px]">
        {/* Logo */}
        <div className="lg:absolute top-6 left-8 flex items-center gap-1 font-semibold mb-6 justify-center lg:justify-start">
          <img src="/logo.png" alt="Logo" className="w-7" />
          <p className="text-2xl">HD</p>
        </div>

        <h2 className="text-3xl lg:text-4xl font-bold mb-2">Sign up</h2>
        <p className="text-[#969696] mb-7 text-md">
          Sign up to enjoy the feature of HD
        </p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative w-full">
            <label
              htmlFor="fullName"
              className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={otpSent}
              className="w-full border border-gray-300 rounded-lg px-4 pt-4 pb-2 text-black focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* DOB */}
          <div className="relative w-full">
            <label
              htmlFor="dob"
              className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              disabled={otpSent}
              className="w-full border border-gray-300 rounded-lg px-4 pt-4 pb-2 text-black focus:outline-none focus:border-blue-600"
            />
          </div>

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

          {/* OTP */}
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3  text-black focus:outline-none focus:border-blue-600"
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
              OTP failed. Please try again.
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
              ? "Sign Up"
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
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in
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

export default Signup;
