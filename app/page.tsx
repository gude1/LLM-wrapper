/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ResponeChatMsgItem from "@/components/ResponeChatMsgItem";
import SenderChatMsgItem from "@/components/SenderChatMsgItem";
import TextEditor from "@/components/TextEditor";
import { useLLmChatStream } from "@/hooks/useLLmChatStream";
import { generateUniqueId } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  id: string; // Made id required
  content: string;
};

export default function Home() {
  const { response, isLoading, error, sendMessage, cancelStream } =
    useLLmChatStream();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle stream response changes
  useEffect(() => {
    if (!response || !currentStreamId) return;
    handleMessageStreamResponse();
  }, [response, currentStreamId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessageStreamResponse = () => {
    setMessages((prevMessages) => {
      const messageIndex = prevMessages.findIndex(
        (msg) => msg.id === currentStreamId
      );

      if (messageIndex === -1) {
        // Add new message if not found
        return [
          ...prevMessages,
          {
            role: "assistant",
            content: response,
            id: currentStreamId!,
          },
        ];
      }

      // Update existing message
      const newMessages = [...prevMessages];
      newMessages[messageIndex] = {
        ...newMessages[messageIndex],
        content: response,
      };
      return newMessages;
    });
  };

  const handleSubmit = async (html: string) => {
    try {
      const newMessageId = generateUniqueId();
      setCurrentStreamId(newMessageId);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "user",
          content: html,
          id: generateUniqueId(),
        },
      ]);

      await sendMessage(html);
    } catch (err) {
      console.error("Chat submission error:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleRetry = async (messageId: string) => {
    const messageToRetry = messages.find((msg) => msg.id === messageId);
    if (!messageToRetry) return;

    try {
      setCurrentStreamId(messageId);
      await sendMessage(messageToRetry.content);
    } catch (err) {
      console.error("Retry error:", err);
      alert("Failed to retry message. Please try again.");
    }
  };

  return (
    <>
      <main className="flex flex-col mb-64">
        <div className="flex flex-col w-[92%] pt-4 max-w-[56.25rem] self-center">
          {messages.map((message) =>
            message.role === "assistant" ? (
              <ResponeChatMsgItem key={message.id} content={message.content} />
            ) : (
              <SenderChatMsgItem key={message.id} content={message.content} />
            )
          )}
        </div>
      </main>
      <footer className="pb-4 fixed z-40 bg-background px-5 bottom-0 left-0 right-0 md:ml-64 flex justify-center">
        <TextEditor
          onSubmit={handleSubmit}
          loading={isLoading}
          onCancel={cancelStream}
        />
      </footer>
      <div ref={messagesEndRef} />
    </>
  );
}
