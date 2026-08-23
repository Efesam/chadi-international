import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaHeading,
  FaImage,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

function ToolbarButton({ onClick, active, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`rounded px-2.5 py-1.5 text-sm transition disabled:opacity-30 ${
        active ? "bg-chadi-green text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * A minimal rich text editor for long-form content fields (news articles,
 * story write-ups). Stores its value as HTML.
 */
function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-40 px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 focus-within:border-chadi-green">
      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="Bold"
        >
          <FaBold size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="Italic"
        >
          <FaItalic size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="Heading"
        >
          <FaHeading size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Bullet list"
        >
          <FaListUl size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Numbered list"
        >
          <FaListOl size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Image URL (paste a link, or an uploaded image's URL)");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          label="Insert image"
        >
          <FaImage size={13} />
        </ToolbarButton>
        <div className="mx-1 w-px bg-gray-200" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          label="Undo"
        >
          <FaUndo size={13} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          label="Redo"
        >
          <FaRedo size={13} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextEditor;
