"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useCallback, useRef, useState } from "react";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Quote,
  Heading2,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { adminFetch } from "@/lib/adminApi";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ImageExtension.configure({ HTMLAttributes: { class: "rounded-xl" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-brand-red underline" } }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const media = await adminFetch<{ url: string }>("/api/media", {
          method: "POST",
          body: formData,
        });
        editor.chain().focus().setImage({ src: media.url }).run();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Image upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [editor]
  );

  if (!editor) return null;

  function ToolbarButton({
    onClick,
    active,
    children,
    label,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    label: string;
  }) {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${active ? "bg-gray-200 text-brand-red" : "text-navy"}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-2 bg-gray-50">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <BoldIcon size={17} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <ItalicIcon size={17} />
        </ToolbarButton>
        <ToolbarButton label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={17} />
        </ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={17} />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={17} />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon size={17} />
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={17} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
            e.target.value = "";
          }}
        />
        <div className="flex-1" />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={17} />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={17} />
        </ToolbarButton>
      </div>

      {uploading && <p className="text-xs text-gray-500 px-4 pt-2">Uploading image...</p>}

      <EditorContent editor={editor} />
    </div>
  );
}
