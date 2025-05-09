import { Channel, Window, ChannelHeader, MessageList, MessageInput, Thread } from "stream-chat-react";

interface ChatChannelProps {
    show: boolean;
}

export default function ChatChannel({show}: Readonly<ChatChannelProps>) {
    return (
        <div className={`w-full h-full ${show ? "block" : "hidden"}`}>
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
        </div>
    );
}