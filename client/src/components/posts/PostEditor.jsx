import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Undo,
  Redo,
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const btnClass = (active) =>
    `p-2 rounded hover:bg-neutral-800 transition-colors cursor-pointer ${
      active ? 'bg-neutral-800 text-amber' : 'text-cream-muted hover:text-cream-light'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-800 bg-[#141414] p-2 rounded-t">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic size={16} />
      </button>

      <div className="h-6 w-px bg-neutral-800 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </button>

      <div className="h-6 w-px bg-neutral-800 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>

      <div className="h-6 w-px bg-neutral-800 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive('blockquote'))}
        title="Blockquote"
      >
        <Quote size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btnClass(editor.isActive('codeBlock'))}
        title="Code Block"
      >
        <Code size={16} />
      </button>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded text-cream-muted hover:text-cream-light hover:bg-neutral-800 transition-colors disabled:opacity-30 cursor-pointer"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded text-cream-muted hover:text-cream-light hover:bg-neutral-800 transition-colors disabled:opacity-30 cursor-pointer"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
    </div>
  );
};

const PostEditor = ({ content = '', onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) onChange(html);
    },
  });

  // Sync content updates (e.g. from api load)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-neutral-850 rounded bg-bg-card flex flex-col min-h-[400px]">
      <MenuBar editor={editor} />
      <div className="flex-grow overflow-y-auto px-4 max-h-[60vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default PostEditor;
