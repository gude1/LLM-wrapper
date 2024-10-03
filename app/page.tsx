"use client";

import { ResponeChatMsgItem } from "@/components/ResponeChatMsgItem";
import SenderChatMsgItem from "@/components/SenderChatMsgItem";
import TextEditor from "@/components/TextEditor";
import { useLLmChatStream } from "@/hooks/useLLmChatStream";

export default function Home() {
  const { response, isLoading, error, sendMessage, cancelStream } =
    useLLmChatStream();

  return (
    <>
      <main className="flex flex-col mb-64">
        <div className="flex flex-col w-[92%] max-w-[56.25rem] self-center">
          <ResponeChatMsgItem content={response} />
          <SenderChatMsgItem />
        </div>
      </main>
      <footer className="min-h-32 pb-4 fixed z-40 bg-background px-5 bottom-0 left-0 right-0 md:ml-64 flex justify-center">
        <TextEditor
          onSubmit={(html) => {
            sendMessage(html);
          }}
        />
      </footer>
    </>
  );
}
