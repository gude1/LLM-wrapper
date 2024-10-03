"use client";

import React, { useState } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/Button";
import PaperPlane from "@/public/icons/paper-plane.svg";
import User from "@/public/icons/user.svg";
import Command from "@/public/icons/command.svg";

import {
  Plus,
  Quote,
  Bold,
  Italic,
  List,
  ListOrdered,
  StopCircle,
  Heading1,
  Heading2,
  Code,
  Strikethrough,
} from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import CommandDialog from "@/components/CommandDialog";
import WebScrappingProgressDialog from "./WebScrappingProgressDialog";
import { cn } from "@/lib/utils";

interface TextEditorProps {
  className?: string;
  loading?: boolean;
  onCancel?: () => void;
  onSubmit?: (content: string) => void;
}

const MenuButton = ({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className={`p-1 h-8 text-[#797979] w-8 hover:bg-gray-700 ${
      active ? "text-white" : ""
    }`}
  >
    {children}
  </Button>
);

export default function TextEditor({
  className,
  onSubmit,
  loading = false,
  onCancel,
}: TextEditorProps) {
  const [openCommandDialog, setOpenCommandDialog] = useState(false);
  const [openWebScrapperDialog, setOpenWebScrapperDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder:
          "Type '/' for quick access to the command menu. Use '||' to enter multiple prompts.",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-[#797979] before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[3.3125rem] mx-auto focus:outline-none border-none prose prose-invert max-w-none",
      },
    },
  });

  const handleSubmit = () => {
    if (editor) {
      const content = editor.getHTML();

      if (!editor.getText()) {
        return;
      }
      editor.commands.clearContent();
      if (onSubmit) onSubmit(content); //if onSubmit is defined
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior for Enter key
      handleSubmit();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className={cn(`w-full max-w-[60rem] ${className}`)}>
        <div className="w-full flex flex-col rounded-lg text-white border border-[#2D2D2D] overflow-hidden">
          <div className="flex items-center gap-1 px-2 py-1 border-b border-[#2D2D2D] bg-[#1A1A1A] sticky top-0 z-10">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
            >
              <Bold size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
            >
              <Italic size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
            >
              <Strikethrough size={16} />
            </MenuButton>
            <div className="w-px h-6 bg-[#2D2D2D] mx-1" />
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              active={editor.isActive("heading", { level: 1 })}
            >
              <Heading1 size={16} />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor.isActive("heading", { level: 2 })}
            >
              <Heading2 size={16} />
            </MenuButton>
            <div className="w-px h-6 bg-[#2D2D2D] mx-1" />
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
            >
              <List size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
            >
              <ListOrdered size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive("codeBlock")}
            >
              <Code size={16} />
            </MenuButton>
          </div>

          <div className="flex relative">
            <div className="flex-grow min-w-0 max-h-64 overflow-y-auto pr-[4rem]">
              <EditorContent
                editor={editor}
                className="pl-5 py-5"
                onKeyDown={handleKeyDown} // Add keydown event to trigger on Enter key
              />
            </div>

            <div className="absolute right-0 top-0 h-full flex items-start pt-5 bg-[#121212] pr-3">
              <Button
                variant={"ghost"}
                className="w-9 h-9 p-0 bg-transparent hover:text-white hover:bg-transparent flex items-center justify-center"
                onClick={loading ? onCancel : handleSubmit} // Attach handleSubmit to send button
              >
                {loading ? <StopCircle size={30} /> : <PaperPlane size={25} />}
              </Button>
            </div>
          </div>
        </div>

        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            className="flex items-center gap-1 p-1 rounded-lg bg-[#1A1A1A] border border-[#2D2D2D]"
          >
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
            >
              <Bold size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
            >
              <Italic size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
            >
              <Strikethrough size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive("code")}
            >
              <Code size={16} />
            </MenuButton>
          </BubbleMenu>
        )}

        <div className="mt-5 flex justify-between items-center">
          <div className="flex flex-wrap gap-3 xl:gap-0">
            <Button
              variant={"ghost"}
              onClick={() => setOpenCommandDialog(true)}
              className="p-0 hover:bg-transparent hover:text-white mr-7 w-auto h-auto rounded-none flex items-center justify-center"
            >
              <Command className="mr-2" />
              Commands
            </Button>
            <Button
              variant={"ghost"}
              onClick={() => setOpenWebScrapperDialog(true)}
              className="p-0 hover:bg-transparent hover:text-white mr-7 w-auto h-auto rounded-none flex items-center justify-center"
            >
              <Quote size={16} className="mr-2" />
              Prompts
            </Button>
            <Button
              variant={"ghost"}
              className="p-0 hover:bg-transparent hover:text-white mr-7 w-auto h-auto rounded-none flex items-center justify-center"
            >
              <User className="mr-2" />
              Personas
            </Button>
            <Button
              variant={"ghost"}
              className="p-0 hover:bg-transparent hover:text-white mr-7 w-auto h-auto rounded-none flex items-center justify-center"
            >
              <Plus size={20} className="mr-1" />
              Add
            </Button>
          </div>

          <div className="flex items-center">
            <span className="text-[#797979] mr-3 font-normal leading-[0.983125rem] text-[0.8125rem]">
              32/618
            </span>
            <CircularProgress
              size={22}
              percentage={20}
              circleClassName="stroke-white"
            />
          </div>
        </div>
      </div>
      <CommandDialog
        open={openCommandDialog}
        setOpen={setOpenCommandDialog}
        commandText="Select Command"
      />
      <WebScrappingProgressDialog
        open={openWebScrapperDialog}
        setOpen={setOpenWebScrapperDialog}
      />
    </>
  );
}
