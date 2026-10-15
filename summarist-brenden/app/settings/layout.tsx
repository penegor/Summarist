import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex for-you__layout">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen for-you__main">
        {children}
      </main>
    </div>
  );
}
