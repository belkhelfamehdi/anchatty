import { ChannelList } from "stream-chat-react";
import MenuBar from "./MenuBar";
import { UserResource } from "@clerk/types";

interface ChatSideBarProps {
  user: UserResource;
  show: boolean;
}

export default function ChatSideBar({
  user,
  show,
}: Readonly<ChatSideBarProps>) {
  return (
    <div className={`w-full flex-col md:max-w-xs ${show ? "flex" : "hidden"}`}>
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
      />
    </div>
  );
}
