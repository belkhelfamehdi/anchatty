import { UserButton } from "@clerk/nextjs";
import { Users } from "lucide-react";

export default function MenuBar() {
  return (
    <div className="p-3 flex flex-row items-center justify-between gap-3 bg-green-50 border-e border-green-200 text-green-700">
      <UserButton />
      <div className="flex gap-6">
        <span title="Show users">
          <Users className="cursor-pointer hover:text-green-500 transition" />
        </span>
      </div>
    </div>
  );
}
