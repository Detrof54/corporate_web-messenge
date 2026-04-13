import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className }: Props) => {
  return <div className={`rounded-2xl shadow-lg bg-white ${className}`}>{children}</div>;
};

export const CardContent = ({ children, className }: Props) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};