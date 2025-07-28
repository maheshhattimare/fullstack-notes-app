import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Shield,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";
import Loading from "../components/Loading";

const Signup = () => {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const toggleShowPassword = () => setIsShowPassword((prev) => !prev);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (otpError) setOtpError("");
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }
    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const age =
        new Date().getFullYear() - new Date(formData.dob).getFullYear();
      if (age < 13) errors.dob = "You must be at least 13 years old";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    if (!otpSent) {
      if (!validateForm()) return;
      try {
        setSendingOtp(true);
        await API.post("/users/signup", {
          fullName: formData.fullName.trim(),
          dob: formData.dob,
          email: formData.email.trim(),
        });
        setOtpSent(true);
      } catch (err) {
        console.error("OTP request failed", err);
        setOtpError(
          err?.response?.data?.message ??
            "Failed to send OTP. Please try again."
        );
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
        setOtpError(
          err?.response?.data?.message ?? "Invalid OTP. Please try again."
        );
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    setGoogleLoading(true);
    try {
      const res = await API.post("/users/google-login", {
        credential: response.credential,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setOtpError("Google signup failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (googleLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 relative">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-400/20 dark:to-blue-400/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 dark:from-blue-400/20 dark:to-emerald-400/20 rounded-full blur-xl" />

        <div className="lg:absolute top-8 left-8 flex items-center gap-3 mb-8 lg:mb-0 justify-center lg:justify-start">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg dark:shadow-purple-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              NoteEase
            </h1>
          </div>
        </div>

        <div className="relative z-10 max-w-md mx-auto lg:mx-0 w-full">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-blue-600 dark:from-slate-100 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4 lg:mt-5">
              Join NoteEase
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Create your account and start organizing your thoughts with our
              powerful note-taking platform.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div className="relative group">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border ${
                    formErrors.fullName
                      ? "border-red-500 dark:border-red-400"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 outline-none transition duration-200 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 dark:disabled:text-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                />
              </div>
              {formErrors.fullName && (
                <p className="text-red-500 dark:text-red-200 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formErrors.fullName}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="relative group">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                  className={`w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border ${
                    formErrors.dob
                      ? "border-red-500 dark:border-red-400"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 outline-none transition duration-200 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 dark:disabled:text-slate-600 text-slate-900 dark:text-slate-100`}
                />
              </div>
              {formErrors.dob && (
                <p className="text-red-500 dark:text-red-200 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formErrors.dob}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative group">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                  placeholder="Enter your email address"
                  className={`w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border ${
                    formErrors.email
                      ? "border-red-500 dark:border-red-400"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 outline-none transition duration-200 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 dark:disabled:text-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 dark:text-red-200 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* OTP Input */}
            {otpSent && (
              <div className="relative group animate-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type={isShowPassword ? "text" : "password"}
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6‑digit code"
                    required
                    maxLength={6}
                    className="w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 outline-none transition duration-200 font-mono text-center tracking-widest text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
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
                <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                        OTP sent successfully!
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-300 text-sm mt-1">
                        Check your email for the 6‑digit verification code.
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-300 text-sm mt-1">
                        It expires in 10 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {otpError && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 dark:text-red-200 font-medium">
                      {otpError}
                    </p>
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
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl dark:shadow-purple-500/20 dark:hover:shadow-purple-500/30 flex items-center justify-center gap-2"
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending OTP…</span>
                </>
              ) : verifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying…</span>
                </>
              ) : otpSent ? (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Verify & Create Account</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-500 dark:text-slate-400 font-medium">
                or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setOtpError("Google signup failed. Please try again.")
                }
                theme="outline"
                size="large"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block w-1/2 h-screen p-6 relative">
        <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl dark:shadow-slate-900/40">
          <img
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
            alt="Creative workspace with notebooks and planning materials"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-emerald-500/20 dark:from-purple-400/30 dark:via-blue-400/20 dark:to-emerald-400/30" />

          <div className="absolute top-8 left-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl dark:shadow-slate-900/40 max-w-sm border dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                Join Thousands
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Join thousands of users who trust NoteEase to organize their
              thoughts and boost productivity.
            </p>
          </div>

          <div className="absolute bottom-8 right-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl dark:shadow-slate-900/40 max-w-sm border dark:border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="text-slate-800 dark:text-slate-100 font-semibold">
                  Secure & Private
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Your data is protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
