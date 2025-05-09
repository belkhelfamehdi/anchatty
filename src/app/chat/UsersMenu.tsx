import { useEffect, useState } from "react";
import { Avatar, useChatContext, LoadingChannels as LoadingUsers } from "stream-chat-react";
import { UserResource } from "@clerk/types";
import { Channel, UserResponse } from "stream-chat";
import { ArrowLeft } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";

interface UsersMenuProps {
    loggedInUser: UserResource;
    onClose: () => void;
    onChannelSelected: () => void;
}

export default function UsersMenu({loggedInUser, onClose, onChannelSelected}: Readonly<UsersMenuProps>) {

    const {client, setActiveChannel} = useChatContext();

    const [users, setUsers] = useState<(UserResponse & {image?: string})[]>();

    const [moreUsersLoading, setMoreUsersLoading] = useState(false);
    const [hasNoMoreUsers, setHasNoMoreUsers] = useState<boolean>();

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const [searchInput, setSearchInput] = useState("");

    const pageSize = 10;

    useEffect(() => {
        async function loadInitialUsers(){

            setUsers(undefined);
            setHasNoMoreUsers(undefined);

            try {
                const response = await client.queryUsers({
                    id: {$nin: [loggedInUser.id]},
                    ...(searchInput ? {
                        $or: [{
                            name: {$autocomplete: searchInput},
                        }, {
                            id: {$autocomplete: searchInput},
                        }]
                    } : {}),
                },
                {id: 1},
                {limit: pageSize +1, }
            )
                setUsers(response.users.slice(0, pageSize));
                setHasNoMoreUsers(response.users.length <= pageSize);
            }catch (error) {
                console.error("Error loading initial users: ", error);
            }
        }
        loadInitialUsers();
    }, [client, loggedInUser.id]);

    async function loadMoreUsers() {
        if (moreUsersLoading || hasNoMoreUsers) return;

        setMoreUsersLoading(true);
        try {
            const response = await client.queryUsers({
                $and: [
                    {id: {$in: users?.map(user => user.id).filter(id => id !== loggedInUser.id) || []}},
                    searchInput ? {
                        $or: [{
                            name: {$autocomplete: searchInput},
                        }, {
                            id: {$autocomplete: searchInput},
                        }]
                    }: {},
                ],
            },
            {id: 1},
            {limit: pageSize +1, offset: users?.length}
        )
            setUsers((prev) => [...(prev || []), ...response.users.slice(0, pageSize)]);
            setHasNoMoreUsers(response.users.length <= pageSize);
        }catch (error) {
            console.error("Error loading more users: ", error);
        }finally {
            setMoreUsersLoading(false);
        }
    }

    function handleChannelSelected(channel: Channel) {
        setActiveChannel(channel);
        onChannelSelected();
    }

    async function startChatWithUser(userId: string) {
        try {
            const channel = client.channel("messaging", {
                members: [userId, loggedInUser.id],
            });
            await channel.create();
            handleChannelSelected(channel);
        }catch (error) {
            console.error("Error starting chat with user: ", error);
        }
    }

    return (
        <div className="str-chat bg-white absolute z-10 h-full w-full border-e border-e-[#DBDDE1]">
            <div className="flex flex-col p-3">
            <div className="mb-3 flex items-center gap-3 p-3 text-lg font-bold">
                <ArrowLeft onClick={onClose} className="cursor-pointer" /> Users
            </div>
            <input type="search" placeholder="Search" className="rounded-full border border-gray-300 px-4 py-2" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            </div>
            <div className="px-3 py-2 text-sm text-gray-500">
            {!users ? <LoadingUsers /> : null}
            {users?.map((user) => (
                <UserResult user={user} onUserClicked={startChatWithUser} key={user.id} selected={selectedUsers.includes(user.id)} onChangeSelected={(selected) => setSelectedUsers(selected ? [...selectedUsers, user.id] : selectedUsers.filter(userId => userId !== user.id))} />
            ))}
            {JSON.stringify(selectedUsers)}
            {hasNoMoreUsers === false && (
                <LoadingButton loading={hasNoMoreUsers}
                onClick={loadMoreUsers}
                className="m-auto mb-3 w-3/4">
                    Load more users
                </LoadingButton>
            )}
            </div>
        </div>
    );
}

interface UserResult {
    user: UserResponse & {image?: string};
    onUserClicked: (userId: string) => void;
    selected?: boolean;
    onChangeSelected?: (selected: boolean) => void;
}

function UserResult({user, onUserClicked, selected, onChangeSelected}: Readonly<UserResult>) {
    return (
        <button className="mb-3 w-full flex items-center p-2 gap-2 hover:bg-green-100 transition" onClick={() => onUserClicked(user.id)}>
            <input type="checkbox" className="mx-1 scale-125" checked={selected} onChange={(e) => onChangeSelected?.(e.target.checked)} onClick={(e) => e.stopPropagation} />
            <span><Avatar image={user.image} name={user.name || user.id} /></span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis ">{user.name || user.id}</span>
            {user.online && <span className="w-2 h-2 bg-green-500 rounded-full" />}
        </button>
    );

}