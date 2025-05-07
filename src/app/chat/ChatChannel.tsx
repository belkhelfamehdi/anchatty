import { Channel, Window, ChannelHeader, MessageList, MessageInput, Thread } from "stream-chat-react";

interface ChatChannelProps {
    show: boolean;
    hideChannelOnThread: boolean;
}

export default function ChatChannel({show, hideChannelOnThread}: Readonly<ChatChannelProps>) {
    return (
        <div className={`w-full h-full ${show ? "block" : "hidden"}`}>
        <Channel>
          <Window hideOnThread={hideChannelOnThread}>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
        </div>
    );
}