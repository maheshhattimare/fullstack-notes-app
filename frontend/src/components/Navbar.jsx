const Navbar = ({ handleSignout }) => {
  const buttonClick = () => {
    handleSignout();
  };
  return (
    <nav className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <img className="w-7 h-7" src="/logo.png" alt="Logo" />
        <p className="text-xl font-semibold">Dashboard</p>
      </div>
      <button
        onClick={buttonClick}
        className="text-blue-600 font-semibold hover:underline"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;
