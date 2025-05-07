"use client";
import { useUser } from "@clerk/nextjs";
import { Chat, LoadingIndicator } from "stream-chat-react";
import ChatChannel from "./ChatChannel";
import ChatSideBar from "./ChatSideBar";
import useInitializeChatClient from "./useInitializeChatClient";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import useWindowSize from "@/hooks/useWindowSize";

export default function ChatPage() {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();

  const [chatSideBarOpen, setChatSideBarOpen] = useState(false);

  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= 768;

  useEffect(() => {
    if (windowSize.width >= 768) {
      setChatSideBarOpen(false);
    }
  }, [windowSize.width]);

  const handleSideBarOnClose = useCallback(() => {
    setChatSideBarOpen(false);
  }, []);

  if (!chatClient || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <LoadingIndicator size={65} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 xl:px-20 xl:py-8">
      <div className="min-w-xs m-auto flex h-full max-w-7xl flex-col shadow-sm">
        <Chat client={chatClient}>
          <div className="flex justify-center border-b border-b-[#DBDDE1] p-3 md:hidden">
            <button onClick={() => setChatSideBarOpen(!chatSideBarOpen)}>
              {!chatSideBarOpen ? (
                <span className="flex items-center gap-1">
                  <Menu />
                  Menu
                </span>
              ) : (
                <X />
              )}
            </button>
          </div>
          <div className="flex h-full flex-row overflow-y-auto">
            <ChatSideBar
              user={user}
              show={isLargeScreen || chatSideBarOpen}
              onClose={handleSideBarOnClose}
            />
            <ChatChannel
              show={isLargeScreen || !chatSideBarOpen}
              hideChannelOnThread={!isLargeScreen}
            />
          </div>
        </Chat>
      </div>
    </div>
  );
}
