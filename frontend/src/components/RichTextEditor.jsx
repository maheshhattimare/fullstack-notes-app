import { useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Code,
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

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const executeCommand = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    handleContentChange();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      document.execCommand("createLink", false, url);
      handleContentChange();
    }
  };

  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const codeContainer = document.createElement("div");
    codeContainer.style.margin = "16px 0";

    const codeBlock = document.createElement("pre");
    codeBlock.style.background = "#f1f5f9";
    codeBlock.style.border = "1px solid #e2e8f0";
    codeBlock.style.padding = "12px";
    codeBlock.style.borderRadius = "8px";
    codeBlock.style.fontSize = "14px";
    codeBlock.style.fontFamily = "monospace";
    codeBlock.style.overflowX = "auto";
    codeBlock.style.whiteSpace = "pre-wrap";
    codeBlock.contentEditable = "true";
    codeBlock.textContent = "// Type your code here...";

    const exitButton = document.createElement("button");
    exitButton.innerHTML = "Exit Code Block";
    exitButton.style.background = "#6366f1";
    exitButton.style.color = "white";
    exitButton.style.border = "none";
    exitButton.style.padding = "4px 8px";
    exitButton.style.borderRadius = "4px";
    exitButton.style.fontSize = "12px";
    exitButton.style.cursor = "pointer";
    exitButton.style.marginTop = "8px";
    exitButton.style.display = "block";

    exitButton.onclick = (e) => {
      e.preventDefault();
      const newParagraph = document.createElement("p");
      newParagraph.innerHTML = "<br>";
      codeContainer.parentNode.insertBefore(
        newParagraph,
        codeContainer.nextSibling
      );

      const newRange = document.createRange();
      newRange.setStart(newParagraph, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      editorRef.current.focus();
      handleContentChange();
    };

    codeContainer.appendChild(codeBlock);
    codeContainer.appendChild(exitButton);
    range.deleteContents();
    range.insertNode(codeContainer);

    const codeRange = document.createRange();
    codeRange.selectNodeContents(codeBlock);
    selection.removeAllRanges();
    selection.addRange(codeRange);

    editorRef.current.focus();
    handleContentChange();
  };

  const adjustFontSize = (type) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedNode = selection.focusNode?.parentNode;

    const computedStyle = window.getComputedStyle(selectedNode);
    const currentSize = parseFloat(computedStyle.fontSize) || 14;

    const newSize =
      type === "increase"
        ? Math.min(currentSize + 2, 36)
        : Math.max(currentSize - 2, 10);

    if (!range.collapsed) {
      const contents = range.extractContents();
      const span = document.createElement("span");
      span.style.fontSize = `${newSize}px`;
      span.appendChild(contents);
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      if (selectedNode && selectedNode !== editorRef.current) {
        selectedNode.style.fontSize = `${newSize}px`;
      }
    }

    editorRef.current.focus();
    handleContentChange();
  };

  const toolbarButtons = [
    { icon: Bold, command: () => executeCommand("bold"), title: "Bold" },
    { icon: Italic, command: () => executeCommand("italic"), title: "Italic" },
    {
      icon: Underline,
      command: () => executeCommand("underline"),
      title: "Underline",
    },
    {
      icon: List,
      command: () => executeCommand("insertUnorderedList"),
      title: "Bullet List",
    },
    {
      icon: ListOrdered,
      command: () => executeCommand("insertOrderedList"),
      title: "Numbered List",
    },
    { icon: Link, command: insertLink, title: "Insert Link" },
    { icon: Code, command: insertCodeBlock, title: "Insert Code Block" },
    {
      icon: AlignLeft,
      command: () => executeCommand("justifyLeft"),
      title: "Align Left",
    },
    {
      icon: AlignCenter,
      command: () => executeCommand("justifyCenter"),
      title: "Align Center",
    },
    {
      icon: AlignRight,
      command: () => executeCommand("justifyRight"),
      title: "Align Right",
    },
    { icon: Undo, command: () => executeCommand("undo"), title: "Undo" },
    { icon: Redo, command: () => executeCommand("redo"), title: "Redo" },
    {
      icon: () => <span className="font-bold text-sm">A+</span>,
      command: () => adjustFontSize("increase"),
      title: "Increase Font Size",
    },
    {
      icon: () => <span className="font-bold text-sm">A-</span>,
      command: () => adjustFontSize("decrease"),
      title: "Decrease Font Size",
    },
  ];

  const handleKeyDown = (e) => {
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
    <div
      className={`border rounded-xl overflow-hidden focus-within:border-purple-500 dark:focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/20 dark:focus-within:ring-purple-400/20 transition-all duration-200 bg-white dark:bg-slate-900 ${
        error
          ? "border-red-500 dark:border-red-400"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 sticky top-0 z-30 shadow-sm dark:shadow-slate-900/20">
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.command}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm dark:hover:shadow-slate-900/20 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 group relative"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-40 border dark:border-slate-600">
                {button.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        className="min-h-[200px] max-h-[400px] overflow-y-auto p-4 outline-none prose dark:prose-invert prose-sm max-w-none text-slate-900 dark:text-slate-100"
        style={{ lineHeight: "1.6", fontSize: "14px" }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style>{`
    [contenteditable]:empty:before {
      content: attr(data-placeholder);
      color: #94a3b8;
      pointer-events: none;
    }
    .dark [contenteditable]:empty:before {
      color: #64748b;
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
    [contenteditable] li {
      margin: 4px 0;
    }
    [contenteditable] a {
      color: #8b5cf6;
      text-decoration: underline;
    }
    [contenteditable] a:hover {
      color: #7c3aed;
    }
    .dark [contenteditable] a {
      color: #a78bfa;
    }
    .dark [contenteditable] a:hover {
      color: #8b5cf6;
    }
    [contenteditable] p {
      margin: 8px 0;
    }
    [contenteditable]:focus {
      outline: none;
    }
    [contenteditable] pre {
      position: relative;
      background-color: #f1f5f9;
      border-radius: 6px;
      padding: 12px;
      margin: 12px 0;
      overflow-x: auto;
    }
    .dark [contenteditable] pre {
      background-color: #1e293b;
      color: #e2e8f0;
    }
    [contenteditable] code {
      background-color: #f1f5f9;
      color: #8b5cf6;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 0.875em;
    }
    .dark [contenteditable] code {
      background-color: #334155;
      color: #a78bfa;
    }
    [contenteditable] blockquote {
      border-left: 4px solid #8b5cf6;
      margin: 16px 0;
      padding-left: 16px;
      color: #64748b;
      font-style: italic;
    }
    .dark [contenteditable] blockquote {
      border-left-color: #a78bfa;
      color: #94a3b8;
    }
    [contenteditable] h1, [contenteditable] h2, [contenteditable] h3, 
    [contenteditable] h4, [contenteditable] h5, [contenteditable] h6 {
      font-weight: 600;
      margin: 16px 0 8px 0;
      color: #1e293b;
    }
    .dark [contenteditable] h1, .dark [contenteditable] h2, .dark [contenteditable] h3,
    .dark [contenteditable] h4, .dark [contenteditable] h5, .dark [contenteditable] h6 {
      color: #f1f5f9;
    }
    [contenteditable] strong {
      font-weight: 600;
      color: #1e293b;
    }
    .dark [contenteditable] strong {
      color: #f1f5f9;
    }
    [contenteditable] em {
      font-style: italic;
      color: #475569;
    }
    .dark [contenteditable] em {
      color: #cbd5e1;
    }
  `}</style>
    </div>
  );
};

export default RichTextEditor;
