"use client";

import React from "react";
import MessageRenderer from "@/components/MessageRenderer";
import { Button } from "@/components/Button";
import { Copy, Edit } from "lucide-react";

interface SenderChatMsgItemProps {
  content?: string;
  id?: string;
}

const SenderChatMsgItem: React.FC<SenderChatMsgItemProps> = ({}) => {
  return (
    <div className="flex flex-row w-full justify-end">
      <div className="max-w-[80%] flex flex-col">
        <div className="p-2 bg-border rounded-xl">
          <MessageRenderer content="Testing content content content" />
        </div>
        <div className="self-end flex mt-2">
          <Button
            variant={"ghost"}
            className="w-9 h-9 p-0 bg-border mr-2 flex items-center justify-center"
          >
            <Copy width={14} />
          </Button>
          <Button
            variant={"ghost"}
            className="w-9 h-9 p-0 bg-border mr-2 flex items-center justify-center"
          >
            <Edit width={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SenderChatMsgItem;
