import { UserButton } from "@clerk/nextjs";
import { Users } from "lucide-react";

interface MenuBarProps {
  onUserMenuClick: () => void;
}

export default function MenuBar({onUserMenuClick}: Readonly<MenuBarProps>) {
  return (
    <div className="p-3 flex flex-row items-center justify-between gap-3 bg-green-50 border-e border-green-200 text-green-700">
      <UserButton />
      <div className="flex gap-6">
        <span title="Show users">
          <Users className="cursor-pointer hover:text-green-500 transition" onClick={onUserMenuClick} />
        </span>
      </div>
    </div>
  );
}
