"use client";

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