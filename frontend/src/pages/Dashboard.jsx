import { useState } from "react";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen px-4 py-6 max-w-4xl mx-auto">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <img className="w-7 h-7" src="/logo.png" alt="Logo" />
          <p className="text-xl font-semibold">Dashboard</p>
        </div>
        <button className="text-blue-600 font-semibold hover:underline">
          Sign Out
        </button>
      </nav>

      {/* User Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-semibold mb-1">
          Welcome, Jonas Kahnwald!
        </h2>
        <p className="text-gray-600">maheshhattimare@gmail.com</p>
      </div>

      {/* Create Note Button */}
      <div className="mb-6 text-center sm:text-left">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          Create Note
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <p className="text-xl font-semibold">Notes</p>
        {["Note one", "Note two"].map((note, index) => (
          <div
            key={index}
            className="bg-white shadow-md border rounded-lg px-4 py-3 flex justify-between items-center"
          >
            <p className="text-gray-800">{note}</p>
            <button>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.30775 20.5C6.81058 20.5 6.385 20.323 6.031 19.969C5.677 19.615 5.5 19.1894 5.5 18.6922V5.99998H5.25C5.0375 5.99998 4.85942 5.92806 4.71575 5.78423C4.57192 5.6404 4.5 5.46223 4.5 5.24973C4.5 5.03706 4.57192 4.85898 4.71575 4.71548C4.85942 4.57181 5.0375 4.49998 5.25 4.49998H9C9 4.25515 9.08625 4.04648 9.25875 3.87398C9.43108 3.70165 9.63967 3.61548 9.8845 3.61548H14.1155C14.3603 3.61548 14.5689 3.70165 14.7413 3.87398C14.9138 4.04648 15 4.25515 15 4.49998H18.75C18.9625 4.49998 19.1406 4.5719 19.2843 4.71573C19.4281 4.85956 19.5 5.03773 19.5 5.25023C19.5 5.4629 19.4281 5.64098 19.2843 5.78448C19.1406 5.92815 18.9625 5.99998 18.75 5.99998H18.5V18.6922C18.5 19.1894 18.323 19.615 17.969 19.969C17.615 20.323 17.1894 20.5 16.6923 20.5H7.30775ZM17 5.99998H7V18.6922C7 18.7821 7.02883 18.8558 7.0865 18.9135C7.14417 18.9711 7.21792 19 7.30775 19H16.6923C16.7821 19 16.8558 18.9711 16.9135 18.9135C16.9712 18.8558 17 18.7821 17 18.6922V5.99998ZM10.1543 17C10.3668 17 10.5448 16.9281 10.6885 16.7845C10.832 16.6406 10.9037 16.4625 10.9037 16.25V8.74998C10.9037 8.53748 10.8318 8.35931 10.688 8.21548C10.5443 8.07181 10.3662 7.99998 10.1535 7.99998C9.941 7.99998 9.76292 8.07181 9.61925 8.21548C9.47575 8.35931 9.404 8.53748 9.404 8.74998V16.25C9.404 16.4625 9.47583 16.6406 9.6195 16.7845C9.76333 16.9281 9.94158 17 10.1543 17ZM13.8465 17C14.059 17 14.2371 16.9281 14.3807 16.7845C14.5243 16.6406 14.596 16.4625 14.596 16.25V8.74998C14.596 8.53748 14.5242 8.35931 14.3805 8.21548C14.2367 8.07181 14.0584 7.99998 13.8458 7.99998C13.6333 7.99998 13.4552 8.07181 13.3115 8.21548C13.168 8.35931 13.0962 8.53748 13.0962 8.74998V16.25C13.0962 16.4625 13.1682 16.6406 13.312 16.7845C13.4557 16.9281 13.6338 17 13.8465 17Z"
                  fill="#050400"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Note</h3>
            <input
              type="text"
              placeholder="Note title"
              className="w-full border px-4 py-2 rounded-md mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
