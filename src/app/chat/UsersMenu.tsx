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

    const pageSize = 10;

    useEffect(() => {
        async function loadInitialUsers(){

            try {
                const response = await client.queryUsers({
                    id: {$ne: loggedInUser.id},
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
                id: {$ne: loggedInUser.id},
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
            <div className="flex items-center gap-3 p-3 text-lg font-bold">
                <ArrowLeft onClick={onClose} className="cursor-pointer" /> Users
            </div>
            <div className="px-3 py-2 text-sm text-gray-500">
            {!users ? <LoadingUsers className="w-full h-full" /> : null}
            {users?.map((user) => (
                <UserResult key={user.id} user={user} onUserClicked={startChatWithUser} key={user.id} />
            ))}
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
    user: UserResponse & {image?: string}[];
    onUserClicked: (userId: string) => void;
}

function UserResult({user, onUserClicked}: Readonly<UserResult>) {
    return (
        <button className="mb-3 w-full flex items-center p-2 gap-2 hover:bg-green-100 transition" onClick={() => onUserClicked(user.id)}>
            <span><Avatar image={user.image} name={user.name || user.id} /></span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis ">{user.name || user.id}</span>
            {user.online && <span className="w-2 h-2 bg-green-500 rounded-full" />}
        </button>
    );

}