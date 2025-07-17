import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  User,
  FileText,
  X,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RichTextEditor from "../components/RichTextEditor";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(null); // noteId being viewed
  const [editLoading, setEditLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editNoteId, setEditNoteId] = useState(null);
  const [viewNote, setViewNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = token ? jwtDecode(token) : null;
  } catch (err) {
    console.error("Invalid token", err);
    localStorage.removeItem("token");
    navigate("/signin");
  }

  const handleSignout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/signin");
    }, 200);
  };

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data.notes);
      setFilteredNotes(res.data.notes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNoteById = async (id) => {
    try {
      const res = await API.get(`/notes/${id}`);
      return res.data.note;
    } catch (err) {
      console.error("Failed to fetch note by id", err);
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, notes]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchNotes();
    } else {
      setLoading(false);
      navigate("/signin");
    }
  }, []);

  const handleDelete = async (id) => {
    setDeleteConfirm(null);
    try {
      setDeleteLoading(id);
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete note", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const confirmDelete = (note) => {
    setDeleteConfirm(note);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!noteForm.title.trim()) {
      errors.title = "Title is required";
    }
    // For rich text, check if content is empty (only HTML tags without text)
    const textContent = noteForm.content.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      errors.content = "Content is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);
      if (editNoteId) {
        await API.put(`/notes/${editNoteId}`, {
          title: noteForm.title.trim(),
          content: noteForm.content.trim(),
        });
      } else {
        await API.post("/notes", {
          title: noteForm.title.trim(),
          content: noteForm.content.trim(),
        });
      }

      setNoteForm({ title: "", content: "" });
      setEditNoteId(null);
      setShowModal(false);
      setFormErrors({});
      fetchNotes();
    } catch (err) {
      console.error("Failed to submit note", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const openEditModal = async (id) => {
    setEditLoading(id);
    const note = await fetchNoteById(id);
    setEditLoading(null);
    if (note) {
      setNoteForm({ title: note.title, content: note.content });
      setEditNoteId(id);
      setShowModal(true);
    }
  };

  const openViewModal = async (id) => {
    setViewLoading(id); // Start loading
    const note = await fetchNoteById(id);
    setViewLoading(null); // Stop loading
    if (note) setViewNote(note);
  };

  const closeViewModal = () => {
    setViewNote(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditNoteId(null);
    setNoteForm({ title: "", content: "" });
    setFormErrors({});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar handleSignout={handleSignout} user={user} />

      <div className="max-w-7xl mx-auto px-4 pt-1 pb-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl  font-bold text-slate-800 text-wrap">
                  Welcome back, {user?.fullName || "User"}!
                </h1>
                <p className="text-slate-600 mt-1 text-wrap">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{notes.length} notes</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Last updated today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors absolute right-3 top-[7px]"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setNoteForm({ title: "", content: "" });
              setEditNoteId(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Create Note</span>
          </button>
        </div>

        {/* Notes Grid */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-slate-800">Your Notes</h2>
            <span className="text-sm text-slate-500">
              ({filteredNotes.length})
            </span>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {searchTerm ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first note to get started"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Create Your First Note
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => openViewModal(note._id)}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {note.title}
                      </h3>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(note._id);
                          }}
                          disabled={editLoading === note._id}
                          className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-500 hover:text-emerald-600"
                          title="Edit Note"
                        >
                          {editLoading === note._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Edit2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(note);
                          }}
                          disabled={deleteLoading === note._id}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-600"
                          title="Delete Note"
                        >
                          {deleteLoading === note._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {viewLoading === note._id ? (
                        <span className="flex items-center gap-2 text-purple-500 animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-50-500" />
                          Loading...
                        </span>
                      ) : (
                        note.content
                          .replace(/<[^>]*>/g, "")
                          .replace(/&nbsp;/g, " ")
                          .substring(0, 150)
                      )}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{formatDate(note.createdAt)}</span>
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Delete Note
                    </h3>
                    <p className="text-slate-600 text-sm">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete this note? This action cannot
                  be undone and the note will be permanently removed.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm._id)}
                    disabled={deleteLoading === deleteConfirm._id}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {deleteLoading === deleteConfirm._id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        <span>Delete Note</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800">
                    {editNoteId ? "Edit Note" : "Create New Note"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={noteForm.title}
                      onChange={(e) =>
                        setNoteForm({ ...noteForm, title: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-xl border ${
                        formErrors.title ? "border-red-500" : "border-slate-200"
                      } focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200`}
                      placeholder="Enter note title..."
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Content
                    </label>
                    <RichTextEditor
                      value={noteForm.content}
                      onChange={(content) =>
                        setNoteForm({ ...noteForm, content })
                      }
                      placeholder="Write your note content here..."
                      error={formErrors.content}
                    />
                    {formErrors.content && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.content}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>
                          {editNoteId ? "Update Note" : "Create Note"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Note Modal */}
        {viewNote && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800">
                    {viewNote.title}
                  </h3>
                  <button
                    onClick={closeViewModal}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Created: {formatDate(viewNote.createdAt)}
                </p>
              </div>

              <div className="p-6">
                <div className="prose max-w-none">
                  <div
                    className="text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: viewNote.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
