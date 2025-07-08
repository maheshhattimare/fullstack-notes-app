import { Link } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useState } from "react";

const Signup = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => setIsShowPassword((prev) => !prev);

  const [otpSent, setOtpSent] = useState(true);
  const [otpError, setOtpError] = useState(false);

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

        <form className="flex flex-col gap-6">
          {/* Name */}
          <div className="relative w-full">
            <label
              htmlFor="name"
              className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
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
              className="w-full border border-gray-300 rounded-lg px-4 pt-4 pb-2 text-black focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* OTP */}
          <div className="w-full relative">
            <input
              type={isShowPassword ? "text" : "password"}
              id="otp"
              name="otp"
              placeholder="OTP"
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
          {otpSent && (
            <div className="text-sm text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded-md space-y-1">
              <p>✅ OTP has been sent to your email.</p>
              <p className="text-xs text-gray-600">
                This OTP will expire in 5 minutes.
              </p>
            </div>
          )}

          {otpError && (
            <div className="text-sm text-red-700 bg-red-100 border border-red-300 px-4 py-2 rounded-md">
              OTP does not match. Please try again.
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Get OTP
          </button>
        </form>

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
