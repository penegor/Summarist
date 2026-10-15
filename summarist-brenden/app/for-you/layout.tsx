import React from "react";
import Sidebar from "../components/Sidebar";

export default function ForYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex for-you__layout">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen for-you__main">
        {children}
      </main>
    </div>
  );
}