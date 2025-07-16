import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";
import Loading from "../components/Loading";

const Signin = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => setIsShowPassword((prev) => !prev);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (otpError) setOtpError(""); // Clear error when user starts typing
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
        navigate("/dashboard");
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

  const handleGoogleSuccess = async (response) => {
    try {
      setGoogleLoading(true);
      const res = await API.post("/users/google-login", {
        credential: response.credential,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setOtpError("Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // google login loader
  if (googleLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 relative">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-full blur-xl"></div>

        {/* Logo */}
        <a href="/">
          <div className="lg:absolute top-8 left-8 flex items-center gap-3 mb-8 lg:mb-0 justify-center lg:justify-start">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                NoteEase
              </h1>
            </div>
          </div>
        </a>

        {/* Main Content */}
        <div className="relative z-10 max-w-md mx-auto lg:mx-0 w-full">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome Back
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Sign in to access your notes and continue your productivity
              journey.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative group">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>

            {/* OTP Input */}
            {otpSent && (
              <div className="relative group animate-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type={isShowPassword ? "text" : "password"}
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit code"
                    required
                    maxLength={6}
                    className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200 font-mono text-center tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {isShowPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Success Message */}
            {otpSent && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-emerald-800 font-medium">
                        OTP sent successfully!
                      </p>
                      <p className="text-emerald-600 text-sm mt-1">
                        Check your email for the 6-digit verification code. It
                        expires in 10 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {otpError && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 font-medium">{otpError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                sendingOtp || verifying || (otpSent && formData.otp.length < 6)
              }
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : verifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : otpSent ? (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Verify & Sign In</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Send Verification Code</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-slate-500 font-medium">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setOtpError("Google login failed. Please try again.")
                }
                theme="outline"
                size="large"
                width="100%"
              />
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block w-1/2 h-screen p-6 relative">
        <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Professional workspace with notes and laptop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-emerald-500/20"></div>

          {/* Floating Elements */}
          <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800">Smart Notes</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Organize your thoughts, boost productivity, and never lose an
              important idea again.
            </p>
          </div>

          <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="text-slate-800 font-semibold">10,000+ Users</p>
                <p className="text-slate-600 text-sm">Trust our platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
