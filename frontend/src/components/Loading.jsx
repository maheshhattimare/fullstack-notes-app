import { BookOpen, Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center relative">
      <div className="text-center relative z-10">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto animate-pulse">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full border-4 border-white dark:border-gray-900 animate-bounce"></div>
        </div>

        {/* Main Loading Spinner */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-700 rounded-full animate-spin mx-auto">
            <div className="w-full h-full border-4 border-transparent border-t-purple-500 dark:border-t-purple-400 rounded-full"></div>
          </div>

          {/* Orbiting dots */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "3s" }}
          >
            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "2s", animationDirection: "reverse" }}
          >
            <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full absolute top-1/2 -right-1 transform -translate-y-1/2"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
            Loading NoteEase
          </h2>
          <p className="text-slate-600 dark:text-slate-300 animate-pulse">
            Preparing your workspace...
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div
            className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>

      {/* Subtle background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-purple-400/10 dark:to-blue-400/10 rounded-full animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 dark:from-blue-400/10 dark:to-emerald-400/10 rounded-full animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  );
};

export default Loading;
