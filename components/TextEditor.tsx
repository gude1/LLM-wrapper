"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/Button";
import PaperPlane from "@/public/icons/paper-plane.svg";
import User from "@/public/icons/user.svg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import Command from "@/public/icons/command.svg";

import { Link, Plus, Quote, Globe } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import CommandDialog from "@/components/CommandDialog";
import WebScrappingProgressDialog from "./WebScrappingProgressDialog";

interface TextEditorProps {
  className?: string;
}

export default function TextEditor({}: TextEditorProps) {
  const [openCommandDialog, setOpenCommandDialog] = useState(false);
  const [openWebScrapperDialog, setOpenWebScrapperDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
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
          "min-h-[3.3125rem] mx-auto pl-5 py-5 focus:outline-none border-none",
      },
    },
  });

  const openDialog = () => setOpenCommandDialog(true);

  return (
    <>
      <div className="w-full max-w-[60rem]">
        <div className="w-full flex items-center rounded-lg pr-[1.09375rem] text-white  border border-[#2D2D2D] overflow-hidden">
          <EditorContent editor={editor} className="flex-[1]" />
          <span className="mr-3 text-[#747474]">⌘↵ Send</span>
          <Button
            variant={"ghost"}
            className="w-9 h-9 p-0 bg-transparent hover:bg-transparent flex items-center justify-center"
          >
            <PaperPlane size={25} />
          </Button>
        </div>

        <div className="mt-5 flex  justify-between items-center">
          <div className="flex flex-wrap gap-3 xl:gap-0">
            <Button
              variant={"ghost"}
              onClick={openDialog}
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
              circleClassName="text-[#D9D9D9]"
            />
          </div>
        </div>
      </div>

      <CommandDialog
        open={openCommandDialog}
        onOpenChange={setOpenCommandDialog}
      />

      <WebScrappingProgressDialog
        open={openWebScrapperDialog}
        onOpenChange={setOpenWebScrapperDialog}
      />
    </>
  );
}
