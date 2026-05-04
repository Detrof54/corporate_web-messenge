"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

type NavItemProps = {
  href: string;
  active: boolean;
  icon: ReactNode;
  label: string;
};

export function NavItem({ href, active, icon, label }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-center justify-center
        w-16 h-16
        rounded-2xl
        transition-all duration-200
        ${
          active
            ? "bg-gray-700 text-white"
            : "text-gray-500 hover:text-white hover:bg-gray-800"
        }
      `}
    >
      <div className="text-xl">{icon}</div>
      <span className="text-center text-[10px] mt-1">{label}</span>
    </Link>
  );
}


export function NavItemSettings({ href, active, icon, label }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3
        w-full px-4 py-3
        rounded-xl
        transition-all duration-200
        ${
          active
            ? "text-red-500 hover:text-white hover:bg-gray-800"
            : "text-gray-300 hover:text-white hover:bg-gray-800"
        }
      `}
    >
      <div className="text-lg">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
      <ChevronRight size={16} className="ml-auto opacity-60" />
    </Link>
  );
}

export function NavItemEnd({ href, active, icon, label }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-center justify-center
        w-1 h-1
        rounded-2xl
        transition-all duration-200
        text-gray-500 hover:text-white hover:bg-gray-800"
      `}
    >
      <div className="text-xl">{icon}</div>
    </Link>
  );
}
