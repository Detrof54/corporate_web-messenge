"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

type ButtonType = {
  icon: ReactNode;
};

export function Button({icon}: ButtonType) {
  return (
    <button
      className={`
        flex flex-col items-center justify-center
        w-1 h-1
        rounded-2xl
        transition-all duration-200
        text-gray-500 hover:text-white hover:bg-gray-800"
      `}
    >
      <div className="text-xl">{icon}</div>
    </button>
  );
}