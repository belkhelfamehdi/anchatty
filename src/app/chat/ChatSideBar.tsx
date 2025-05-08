import { ChannelList, ChannelPreviewMessenger, ChannelPreviewUIComponentProps } from "stream-chat-react";
import MenuBar from "./MenuBar";
import { UserResource } from "@clerk/types";
import { useCallback, useEffect, useState } from "react";
import UsersMenu from "./UsersMenu";

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
const [usersMenuOpen, setusersMenuOpen] = useState(false);

useEffect(() => {
  if (!show) {
    setusersMenuOpen(false);
  }
}, [show]);

  const channelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        className="hover:bg-green-100 transition"
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose]
  );

  return (
    <div className={`relative w-full flex-col md:max-w-xs ${show ? "flex" : "hidden"} bg-white border-r border-green-200`}>
      {usersMenuOpen && 
        <UsersMenu loggedInUser={user} onClose={() => setusersMenuOpen(false)} onChannelSelected={() => {setusersMenuOpen(false); onClose();}} />
      }
      {/* Logo header */}
      <div className="flex items-center gap-2 p-4 border-b border-green-100">
        <img src="/logo.png" alt="Anchatty Logo" className="w-36 h-auto" />
      </div>

      <MenuBar onUserMenuClick={() => setusersMenuOpen(true)} />

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
