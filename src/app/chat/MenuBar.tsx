import { UserButton } from "@clerk/nextjs";
import { Users } from "lucide-react";

export default function MenuBar() {
    return (
        <div className="p-3 flex flex-row items-center justify-between gap-3 bg-white border-e border-e-[#DBDDE1]">
            <UserButton />
            <div className="flex gap-6 ">
                <span title="Show users">
                    <Users className="cursor-pointer" />
                </span>
            </div>
        </div>
    );
}