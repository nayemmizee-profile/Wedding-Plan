import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function VendorHeader({ user }) {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-100 bg-white/90 px-5 pl-16 backdrop-blur-xl md:px-8">
      <div>
        <h2 className="font-semibold text-[#33232D]">Vendor Dashboard</h2>
        <p className="text-xs text-gray-400">Manage your wedding business</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full bg-gray-50 p-2.5 text-gray-600 hover:bg-pink-50">
          <Search size={19} />
        </button>

        <button className="relative rounded-full bg-gray-50 p-2.5 text-gray-600 hover:bg-pink-50">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#A94F70]" />
        </button>

        <div className="flex items-center gap-3 border-l pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-400">Vendor Account</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#A94F70] font-semibold text-white">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                height={100}
                width={100}
                className="h-full w-full object-cover"
              />
            ) : (
              user.name?.charAt(0)?.toUpperCase()
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
