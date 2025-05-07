import { ChannelList, ChannelPreviewMessenger, ChannelPreviewUIComponentProps } from "stream-chat-react";
import MenuBar from "./MenuBar";
import { UserResource } from "@clerk/types";
import { useCallback } from "react";

interface ChatSideBarProps {
  user: UserResource;
  show: boolean;
  onClose: () => void;
}

export default function ChatSideBar({
    user,
    show,
    onClose,
  }: Readonly<ChatSideBarProps>) {
    const channelPreviewCustom = useCallback(
      (props: ChannelPreviewUIComponentProps) => (
        <ChannelPreviewMessenger
          {...props}
          onSelect={() => {
            props.setActiveChannel?.(props.channel, props.watchers);
            onClose();
          }}
        />
      ),
      [onClose]
    );
  
    return (
      <div className={`w-full flex-col md:max-w-xs ${show ? "flex" : "hidden"} bg-black border-r border-green-800`}>
        <MenuBar />
        <ChannelList
          filters={{
            type: "messaging",
            members: { $in: [user.id] },
          }}
          sort={{ last_message_at: -1 }}
          options={{ state: true, presence: true, limit: 10, watch: true }}
          showChannelSearch
          additionalChannelSearchProps={{
            searchForChannels: true,
            searchQueryParams: {
              channelFilters: {
                filters: {
                  members: { $in: [user.id] },
                },
              },
            },
          }}
          Preview={channelPreviewCustom}
        />
      </div>
    );
  }
  
