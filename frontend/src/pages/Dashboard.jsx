import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Decode user from token
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = token ? jwtDecode(token) : null;
  } catch (err) {
    console.error("Invalid token", err);
    localStorage.removeItem("token");
    navigate("/signin");
  }

  // Logout function
  const handleSignout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/signin");
    }, 200);
  };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data.notes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchNotes();
    } else {
      console.warn("No token found. Redirecting...");
      setLoading(false);
      navigate("/login");
    }
  }, []);

  // Delete note
  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, content } = noteForm;
    if (!title || !content) return;

    try {
      await API.post("/notes", noteForm);
      setNoteForm({ title: "", content: "" });
      setShowModal(false);
      fetchNotes();
    } catch (err) {
      console.error("Failed to create note", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-4xl mx-auto">
      <Navbar handleSignout={handleSignout} />

      {/* User Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-semibold mb-1">
          Welcome, {user?.fullName || "User"}!
        </h2>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      {/*Note Button */}
      <div className="mb-6 text-center sm:text-left">
        <button
          onClick={() => {
            setNoteForm({ title: "", content: "" });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          Create Note
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <p className="text-xl font-semibold">Notes</p>
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes found.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white shadow-md border rounded-lg px-4 py-3 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold break-words">
                  {note.title}
                </h3>
                <p className="mt-2 text-[15px] text-slate-500 leading-relaxed break-words max-w-[320px] sm:max-w-full">
                  {note.content}
                </p>
              </div>

              <button onClick={() => handleDelete(note._id)} title="Delete">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 19.1 7.9 20 9 20H15C16.1 20 17 19.1 17 18V8H7V18ZM18 4H15.5L14.79 3.29C14.61 3.11 14.35 3 14.09 3H9.91C9.65 3 9.39 3.11 9.21 3.29L8.5 4H6V6H18V4Z"
                    fill="red"
                  />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Note</h3>
            <form onSubmit={handleSubmit}>
              <div className="relative w-full mb-6">
                <label
                  htmlFor="title"
                  className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={noteForm.title}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, title: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 pt-4 pb-2 text-black focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="relative w-full mb-4">
                <label
                  htmlFor="content"
                  className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500"
                >
                  Content
                </label>
                <textarea
                  value={noteForm.content}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, content: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-md mb-4 min-h-16"
                  required
                ></textarea>
              </div>

              {/* <textarea
                placeholder="Note content"
                value={noteForm.content}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, content: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md mb-4"
                required
              ></textarea> */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
