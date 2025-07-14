import { LogOut, BookOpen } from "lucide-react";

const Navbar = ({ handleSignout, user }) => {
  const buttonClick = () => {
    handleSignout();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 mb-8 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              NoteEase
            </h1>
            <p className="text-xs text-slate-500 -mt-[2px]">
              Professional Dashboard
            </p>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* User Avatar Placeholder */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold -mt-[1px]">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={buttonClick}
            className="group flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Subtle bottom border gradient */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
    </nav>
  );
};

export default Navbar;
