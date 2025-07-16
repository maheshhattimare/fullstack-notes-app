import { useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";

const RichTextEditor = ({ value, onChange, placeholder, error }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const formatBlock = (tag) => {
    executeCommand("formatBlock", tag);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      command: "bold",
      title: "Bold (Ctrl+B)",
      shortcut: "Ctrl+B",
    },
    {
      icon: Italic,
      command: "italic",
      title: "Italic (Ctrl+I)",
      shortcut: "Ctrl+I",
    },
    {
      icon: Underline,
      command: "underline",
      title: "Underline (Ctrl+U)",
      shortcut: "Ctrl+U",
    },
    {
      icon: List,
      command: "insertUnorderedList",
      title: "Bullet List",
      shortcut: null,
    },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      title: "Numbered List",
      shortcut: null,
    },
    {
      icon: Link,
      command: insertLink,
      title: "Insert Link",
      shortcut: null,
    },
    {
      icon: Quote,
      command: () => formatBlock("blockquote"),
      title: "Quote",
      shortcut: null,
    },
    {
      icon: AlignLeft,
      command: "justifyLeft",
      title: "Align Left",
      shortcut: null,
    },
    {
      icon: AlignCenter,
      command: "justifyCenter",
      title: "Align Center",
      shortcut: null,
    },
    {
      icon: AlignRight,
      command: "justifyRight",
      title: "Align Right",
      shortcut: null,
    },
    {
      icon: Undo,
      command: "undo",
      title: "Undo (Ctrl+Z)",
      shortcut: "Ctrl+Z",
    },
    {
      icon: Redo,
      command: "redo",
      title: "Redo (Ctrl+Y)",
      shortcut: "Ctrl+Y",
    },
  ];

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          executeCommand("bold");
          break;
        case "i":
          e.preventDefault();
          executeCommand("italic");
          break;
        case "u":
          e.preventDefault();
          executeCommand("underline");
          break;
        case "z":
          e.preventDefault();
          executeCommand("undo");
          break;
        case "y":
          e.preventDefault();
          executeCommand("redo");
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3">
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (typeof button.command === "function") {
                  button.command();
                } else {
                  executeCommand(button.command);
                }
              }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 text-slate-600 hover:text-purple-600 group relative"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {button.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        className={`min-h-[200px] p-4 outline-none prose prose-sm max-w-none ${
          error ? "border-red-500" : ""
        }`}
        style={{
          lineHeight: "1.6",
          fontSize: "14px",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Placeholder styling */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }

        [contenteditable] blockquote {
          border-left: 4px solid #8b5cf6;
          padding-left: 16px;
          margin: 16px 0;
          color: #64748b;
          font-style: italic;
        }

        [contenteditable] ul {
          padding-left: 24px;
          margin: 12px 0;
          list-style-type: disc;
        }

        [contenteditable] ol {
          padding-left: 24px;
          margin: 12px 0;
          list-style-type: decimal;
        }


        [contenteditable] a {
          color: #8b5cf6;
          text-decoration: underline;
        }

        [contenteditable] a:hover {
          color: #7c3aed;
        }

        [contenteditable] p {
          margin: 8px 0;
        }

        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
