"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { NavItem } from "../ui/sidebar";
import { Folder, MessageCircle, Bell, Settings } from "lucide-react";

//Боковая панель навигации для приложения
export function Sidebar({ userId }: { userId: string }) {


    const pathname = usePathname();

    const { data, isLoading } = api.sidebar.getListFolders.useQuery();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col w-20 h-full bg-gray-900 items-center py-4 gap-4">
            <NavItem
            href="/"
            active={pathname === "/"}
            icon={<MessageCircle size={20} />}
            label="Чаты"
            />

            {data?.folder.map((folder) => (
            <NavItem
                key={folder.id}
                href={`/folder/${folder.id}`}
                active={pathname === `/folder/${folder.id}`}
                icon={<Folder size={20} />}
                label={folder.name}
            />
            ))}
        
            <div className="mt-auto flex flex-col gap-4" >
                <NavItem
                href={`/notifications/${userId}`}
                active={false}
                icon={<Bell size={20} />}
                label="Уведомления"
                />
            
                <NavItem
                href={`/settings/${userId}`}
                active={false}
                icon={<Settings size={20} />}
                label="Настройки"
                />
            </div>

        </div>
  );
}
