"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import MenuBar from "./menuBar";
import { Redo2, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";

const TextEditor = ({
  content,
  onChange,
  showBottomBar = false,
  errors = null,
  children,
}) => {
  const [showSave, setShowSave] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "text-editor",
      },
    },
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());
      onChange(editor.getHTML());
      setShowSave(true);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleSave = () => {
    // Your save logic (already handled via `onChange`, or explicitly trigger it)
    setShowSave(false);
  };

  const handleCancel = () => {
    editor.commands.setContent(content);
    setShowSave(false);
  };

  return (
    <div className="rich-text-editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      {Object.entries(errors || [])?.map(([key, value]) => (
        <div className="error" key={key}>
          {value}
        </div>
      ))}

      {showBottomBar && (
        <div className="bottom-bar">
          <div className="btns">
            <button onClick={() => editor && editor.commands.undo()}>
              <Undo2 className="icon" />
            </button>
            <button onClick={() => editor && editor.commands.redo()}>
              <Redo2 className="icon" />
            </button>
          </div>

          {showSave && (
            <div className="flex">
              <button onClick={handleCancel} className="white-cta">
                Cancel
              </button>
              <button onClick={handleSave} className="black-cta">
                Save
              </button>
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default TextEditor;
