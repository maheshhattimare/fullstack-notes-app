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
  Pin,
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
  const [viewLoading, setViewLoading] = useState(null);
  const [editLoading, setEditLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editNoteId, setEditNoteId] = useState(null);
  const [viewNote, setViewNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);

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

  const nameParts = user?.fullName?.split(" ") || ["FirstName", "LastName"];
  const firstName = nameParts[0];

  const handleSignout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/signin");
    }, 200);
  };

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data.notes || []);
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

  useEffect(() => {
    let tempNotes = [...notes];
    if (searchTerm.trim() !== "") {
      const lowercasedTerm = searchTerm.toLowerCase();
      tempNotes = tempNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowercasedTerm) ||
          note.content.toLowerCase().includes(lowercasedTerm)
      );
    }
    if (showOnlyPinned) {
      tempNotes = tempNotes.filter((note) => note.isPinned);
    }
    setFilteredNotes(tempNotes);
  }, [searchTerm, notes, showOnlyPinned]);

  useEffect(() => {
    if (token) {
      fetchNotes();
    } else {
      setLoading(false);
      navigate("/signin");
    }
  }, [token, navigate]);

  const handleTogglePin = async (id) => {
    const originalNotes = [...notes];
    const updatedNotes = notes.map((n) =>
      n._id === id ? { ...n, isPinned: !n.isPinned } : n
    );
    updatedNotes.sort((a, b) => b.isPinned - a.isPinned);
    setNotes(updatedNotes);
    try {
      await API.patch(`/notes/${id}/pin`);
    } catch (err) {
      console.error("Failed to update pin status", err);
      setNotes(originalNotes);
    }
  };

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

  const confirmDelete = (note) => setDeleteConfirm(note);
  const cancelDelete = () => setDeleteConfirm(null);

  const validateForm = () => {
    const errors = {};
    if (!noteForm.title.trim()) errors.title = "Title is required";
    const textContent = noteForm.content.replace(/<[^>]*>/g, "").trim();
    if (!textContent) errors.content = "Content is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitLoading(true);
    try {
      const payload = {
        title: noteForm.title.trim(),
        content: noteForm.content.trim(),
      };
      if (editNoteId) {
        await API.put(`/notes/${editNoteId}`, payload);
      } else {
        await API.post("/notes", payload);
      }
      closeModal();
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
    setViewLoading(id);
    const note = await fetchNoteById(id);
    setViewLoading(null);
    if (note) setViewNote(note);
  };

  const closeViewModal = () => setViewNote(null);
  const closeModal = () => {
    setShowModal(false);
    setEditNoteId(null);
    setNoteForm({ title: "", content: "" });
    setFormErrors({});
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  if (loading) return <Loading />;

  const renderNoteCard = (note) => (
    <div
      key={note._id}
      onClick={() => openViewModal(note._id)}
      className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 border border-slate-200 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-slate-900/60 transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden cursor-pointer"
    >
      {note.isPinned && (
        <Pin className="absolute top-4 right-4 w-5 h-5 text-amber-500" />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors pr-8">
            {note.title}
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePin(note._id);
              }}
              title={note.isPinned ? "Unpin Note" : "Pin Note"}
              className={`p-2 rounded-lg transition-colors ${
                note.isPinned
                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              }`}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(note._id);
              }}
              disabled={editLoading === note._id}
              className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300"
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
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
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
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
          {viewLoading === note._id ? (
            <span className="flex items-center gap-2 text-purple-500 dark:text-purple-400 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </span>
          ) : (
            note.content
              .replace(/<[^>]*>/g, "")
              .replace(/&nbsp;/g, " ")
              .substring(0, 150)
          )}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{formatDate(note.createdAt)}</span>
          <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar handleSignout={handleSignout} user={user} />
      <div className="max-w-7xl mx-auto px-4 pt-1 pb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/40 border border-slate-200 dark:border-slate-700 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-400/20 dark:to-blue-400/20 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg dark:shadow-purple-500/20">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 text-wrap">
                  Welcome back, {firstName || "User"}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-wrap">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
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
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 outline-none transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors absolute right-3 top-[7px]"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowOnlyPinned(!showOnlyPinned)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md ${
              showOnlyPinned
                ? "bg-amber-400 dark:bg-amber-500 text-white"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Pin className="w-5 h-5" />
            <span>Pinned</span>
          </button>
          <button
            onClick={() => {
              setNoteForm({ title: "", content: "" });
              setEditNoteId(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-purple-500/20 dark:hover:shadow-purple-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>Create Note</span>
          </button>
        </div>
        <div className="mb-6">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                {searchTerm || showOnlyPinned
                  ? "No notes found"
                  : "No notes yet"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {searchTerm || showOnlyPinned
                  ? "Try adjusting your search or filters"
                  : "Create your first note to get started"}
              </p>
              {!searchTerm && !showOnlyPinned && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg dark:shadow-purple-500/20"
                >
                  Create Your First Note
                </button>
              )}
            </div>
          ) : (
            <>
              {pinnedNotes.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-4">
                    Pinned
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pinnedNotes.map(renderNoteCard)}
                  </div>
                </div>
              )}
              {unpinnedNotes.length > 0 && (
                <div>
                  {pinnedNotes.length > 0 && (
                    <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-4">
                      Other Notes
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unpinnedNotes.map(renderNoteCard)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/50 w-full max-w-md transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4 border dark:border-slate-700">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Delete Note
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to delete this note? This action cannot
                  be undone and the note will be permanently removed.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm._id)}
                    disabled={deleteLoading === deleteConfirm._id}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 dark:from-red-600 dark:to-pink-600 dark:hover:from-red-700 dark:hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg dark:shadow-red-500/20"
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
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 border dark:border-slate-700">
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {editNoteId ? "Edit Note" : "Create New Note"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={noteForm.title}
                      onChange={(e) =>
                        setNoteForm({ ...noteForm, title: e.target.value })
                      }
                      className={`w-full px-4 py-3 rounded-xl border ${
                        formErrors.title
                          ? "border-red-500 dark:border-red-400"
                          : "border-slate-200 dark:border-slate-700"
                      } focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 outline-none transition-all duration-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                      placeholder="Enter note title..."
                    />
                    {formErrors.title && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
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
                    className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg dark:shadow-purple-500/20"
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
        {viewNote && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto border dark:border-slate-700">
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {viewNote.title}
                  </h3>
                  <button
                    onClick={closeViewModal}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Created: {formatDate(viewNote.createdAt)}
                </p>
              </div>
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div
                    className="text-slate-700 dark:text-slate-300 leading-relaxed prose-headings:text-slate-800 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-800 dark:prose-strong:text-slate-100 prose-em:text-slate-700 dark:prose-em:text-slate-300 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400 prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-pre:bg-slate-100 dark:prose-pre:bg-slate-900 prose-pre:text-slate-800 dark:prose-pre:text-slate-200"
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
