"use client";
import { useUser } from "@clerk/nextjs";
import {
    Chat,
    LoadingIndicator
} from "stream-chat-react";
import ChatChannel from "./ChatChannel";
import ChatSideBar from "./ChatSideBar";
import useInitializeChatClient from "./useInitializeChatClient";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function ChatPage() {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();

  const [chatSideBarOpen, setChatSideBarOpen] = useState(false);

  if (!chatClient || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Chat client={chatClient}>
        <div className="flex justify-center border-b border-b-[#DBDDE1] p-3 md:hidden">
            <button onClick={() => setChatSideBarOpen(!chatSideBarOpen)}>
                {!chatSideBarOpen ? (
                    <span className="flex items-center gap-1"><Menu />Menu</span>
                ) : (
                    <X />
                )}
            </button>
        </div>
        <div className="flex h-full flex-row">
            <ChatSideBar user={user} show={chatSideBarOpen} />
            <ChatChannel show={!chatSideBarOpen} />
        </div>
      </Chat>
    </div>
  );
}
