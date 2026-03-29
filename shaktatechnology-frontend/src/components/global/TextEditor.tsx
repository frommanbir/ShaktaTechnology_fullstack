"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
  Check,
  X,
} from "lucide-react";

interface TextEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: TextEditorProps) {
  const [, setUpdate] = useState(0);
  const forceUpdate = useCallback(() => setUpdate((v) => v + 1), []);

  const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 dark:text-blue-400 underline cursor-pointer",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: forceUpdate,
    onTransaction: forceUpdate,
  });



  const handleSetLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      let formattedUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl) && !/^mailto:/i.test(formattedUrl) && !/^tel:/i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: formattedUrl }).run();
    }
    setIsLinkPopupOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const openLinkPopup = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setIsLinkPopupOpen(true);
  }, [editor]);

  // Sync content from outside (important for async loading in edit forms)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const getButtonStyles = (isActive: boolean, isDisabled: boolean = false) => {
    const base = "p-2 rounded-lg transition-all duration-200 flex items-center justify-center ";
    const active = isActive 
      ? "bg-blue-600 text-white shadow-md scale-105 z-10" 
      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50";
    const disabled = isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer";
    return `${base} ${active} ${disabled}`;
  };

  return (
    <div className="relative group border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10">
      {/* Link Popup Overlay */}
      {isLinkPopupOpen && (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-2 px-2 pointer-events-none">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl p-2 flex gap-2 items-center pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200 w-full max-w-sm">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
              <LinkIcon size={14} className="text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSetLink();
                  if (e.key === "Escape") setIsLinkPopupOpen(false);
                }}
                className="bg-transparent text-sm focus:outline-none w-full text-gray-800 dark:text-gray-200"
              />
            </div>
            <button
              type="button"
              onClick={handleSetLink}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIsLinkPopupOpen(false)}
              className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/80 backdrop-blur-md flex-wrap items-center">
        <div className="flex gap-1">
          <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={getButtonStyles(false, !editor.can().undo())} title="Undo">
            <Undo size={18} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={getButtonStyles(false, !editor.can().redo())} title="Redo">
            <Redo size={18} />
          </button>
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <div className="flex gap-1">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={getButtonStyles(editor.isActive("bold"))} title="Bold">
            <Bold size={18} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={getButtonStyles(editor.isActive("italic"))} title="Italic">
            <Italic size={18} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={getButtonStyles(editor.isActive("underline"))} title="Underline">
            <UnderlineIcon size={18} />
          </button>
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <div className="flex gap-1">
          {[1, 2, 3].map((l) => (
            <button key={l} type="button" onClick={() => editor.chain().focus().toggleHeading({ level: l as any }).run()} className={getButtonStyles(editor.isActive("heading", { level: l }))} title={`Heading ${l}`}>
              {l === 1 ? <Heading1 size={18} /> : l === 2 ? <Heading2 size={18} /> : <Heading3 size={18} />}
            </button>
          ))}
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <div className="flex gap-1">
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={getButtonStyles(editor.isActive("bulletList"))} title="Bullet List">
            <List size={18} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={getButtonStyles(editor.isActive("orderedList"))} title="Ordered List">
            <ListOrdered size={18} />
          </button>
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <div className="flex gap-1">
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={getButtonStyles(editor.isActive("blockquote"))} title="Blockquote">
            <Quote size={18} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={getButtonStyles(editor.isActive("codeBlock"))} title="Code Block">
            <Code size={18} />
          </button>
          <button type="button" onClick={openLinkPopup} className={getButtonStyles(editor.isActive("link"))} title="Add Link">
            <LinkIcon size={18} />
          </button>
        </div>
      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu editor={editor} className="flex overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl divide-x divide-gray-100 dark:divide-gray-700">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive("bold") ? "text-blue-600 bg-blue-50 dark:bg-blue-900/40" : "text-gray-600 dark:text-gray-300"}`}><Bold size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive("italic") ? "text-blue-600 bg-blue-50 dark:bg-blue-900/40" : "text-gray-600 dark:text-gray-300"}`}><Italic size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive("underline") ? "text-blue-600 bg-blue-50 dark:bg-blue-900/40" : "text-gray-600 dark:text-gray-300"}`}><UnderlineIcon size={16} /></button>
          <button type="button" onClick={openLinkPopup} className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive("link") ? "text-blue-600 bg-blue-50 dark:bg-blue-900/40" : "text-gray-600 dark:text-gray-300"}`}><LinkIcon size={16} /></button>
        </BubbleMenu>
      )}

      {/* Editor Content Area */}
      <div className="relative min-h-[180px] p-4 bg-white dark:bg-gray-900 transition-colors duration-300 cursor-text" onClick={() => editor.chain().focus()}>
        <style jsx global>{`
          .ProseMirror { outline: none; min-height: 180px; font-size: 0.95rem; line-height: 1.6; color: inherit; }
          .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #9ca3af; pointer-events: none; height: 0; font-style: italic; }
          .dark .ProseMirror p.is-editor-empty:first-child::before { color: #4b5563; }
          .ProseMirror p { margin-bottom: 0.75rem; }
          .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
          .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
          .ProseMirror blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 1rem 0; color: #4b5563; font-style: italic; background: #f8fafc; padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .dark .ProseMirror blockquote { background: #1e293b; color: #94a3b8; border-left-color: #2563eb; }
          .ProseMirror code { background-color: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.375rem; font-family: monospace; font-size: 0.875em; color: #ef4444; }
          .dark .ProseMirror code { background-color: #1e293b; color: #f87171; }
          .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
          .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
          .ProseMirror h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
        `}</style>
        <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none" />
      </div>
    </div>
  );
}