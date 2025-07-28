import { useState, useRef, useEffect } from "react";
import { LogOut, BookOpen, Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const Navbar = ({ handleSignout, user }) => {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Handles closing the profile dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the profile dropdown area
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    // Add event listener only when the profile dropdown is open
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  const buttonClick = () => {
    handleSignout();
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-lg dark:shadow-slate-900/20 p-4 mb-8 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg dark:shadow-purple-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              NoteEase
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-[2px]">
              Professional Dashboard
            </p>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="group relative p-2.5 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 rounded-xl border border-slate-200 dark:border-slate-600 shadow-md dark:shadow-slate-900/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg dark:hover:shadow-purple-500/10"
            title={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
          >
            <div className="relative w-5 h-5">
              <Sun className="w-5 h-5 text-amber-500 transition-all duration-300 transform rotate-0 scale-100 dark:-rotate-90 dark:scale-0 absolute inset-0" />
              <Moon className="w-5 h-5 text-slate-400 dark:text-blue-400 transition-all duration-300 transform rotate-90 scale-0 dark:rotate-0 dark:scale-100 absolute inset-0" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 to-blue-400/0 group-hover:from-purple-400/10 group-hover:to-blue-400/10 dark:group-hover:from-purple-400/5 dark:group-hover:to-blue-400/5 transition-all duration-300"></div>
          </button>
          {/* This container is now relative to position the dropdown */}
          <div className="relative  block" ref={profileRef}>
            {/* User Avatar Button */}
            <button
              onClick={() => setProfileOpen(!profileOpen)} // Toggle dropdown on click
              className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-md dark:shadow-purple-400/20 transition-transform transform hover:scale-110"
              title="Open Profile"
            >
              <span className="text-white text-sm font-semibold -mt-[1px]">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div
                className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl dark:shadow-slate-900/40 border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ease-in-out transform origin-top-right
                opacity-100 scale-100"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 break-words">
                    {user.email || "No email provided"}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={buttonClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-500/20 dark:via-purple-400/30 to-transparent"></div>
    </nav>
  );
};

export default Navbar;
