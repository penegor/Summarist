import React from "react";
import Sidebar from "../components/Sidebar";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex for-you__layout">
      {/* Sidebar will ONLY render inside the /dashboard routes */}
      <Sidebar />
      
      {/* Main content area for dashboard pages */}
      <main className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen for-you__main">
        {children}
      </main>
    </div>
  );
}