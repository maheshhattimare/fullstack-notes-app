const Loading = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="animate-spin inline-block h-12 w-12 border-4 border-current border-t-transparent text-blue-600 rounded-full"
        role="status"
        aria-label="loading"
      ></div>
    </div>
  );
};

export default Loading;
