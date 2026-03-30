import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shakta Technology - Admin Panel",
  description: "Secure Admin Management System",
  icons: {
    icon: " "
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
        <div className="admin-theme flex h-screen bg-background text-foreground font-poppins selection:bg-blue-100">
          <Sidebar />
          <div className="flex-1 ml-64 overflow-hidden flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 mt-16 overflow-y-auto bg-background/50">
              {children}
            </main>
          </div>
        </div>
    </ProtectedRoute>
  );
}
