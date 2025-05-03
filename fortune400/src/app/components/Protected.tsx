"use client";
import React from "react";
import { LockFilled } from "@ant-design/icons";

interface ProtectedProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export default function Protected({
  isAuthenticated,
  children,
}: ProtectedProps) {
  if (!isAuthenticated) {
    return (
      <div className="text-center h-[500px] pt-20">
        <p className="text-black text-2xl py-6 mb-4">
          Sign in to unlock all features
        </p>
        <LockFilled className="text-3xl text-black" />
      </div>
    );
  }
  return <>{children}</>;
}
