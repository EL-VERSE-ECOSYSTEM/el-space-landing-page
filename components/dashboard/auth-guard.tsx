"use client";
import React from 'react';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Auth guard component
export function useAuth(redirectTo?: string) {
  const router = useRouter();
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push(redirectTo || "/auth/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (e) {
        localStorage.removeItem("authToken");
        router.push("/auth/login");
      }
    } else {
      // Try to decode token
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setUser(payload);
        }
      } catch (e) {
        localStorage.removeItem("authToken");
        router.push("/auth/login");
      }
    }
    
    setLoading(false);
  }, [router, redirectTo]);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/");
  };

  return { user, loading, logout };
}

export function AuthGuard({ children, userType, redirectPath }: { 
  children: React.ReactNode; 
  userType?: "client" | "freelancer";
  redirectPath?: string;
}) {
  const { user, loading, logout } = useAuth("/auth/login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check user type if specified
  const u = user as any;
  if (userType && u.user_type !== userType && u.userType !== userType) {
    // Redirect to correct dashboard
    window.location.href = u.user_type === "freelancer" ? "/freelancer" : "/client";
    return null;
  }

  return <>{children}</>;
}

export function DashboardLayout({ 
  children, 
  userType,
  navItems 
}: { 
  children: React.ReactNode; 
  userType: "client" | "freelancer";
  navItems: { label: string; href: string; icon?: React.ReactNode }[];
}) {
  const { user, logout } = useAuth("/auth/login");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const u = user as any;
  const userName = u.name || u.email || "User";
  const elSpaceId = u.el_space_id || "EL-XXXXXXXX";

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-md text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-40 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span className="text-2xl font-bold">
              <span className="text-cyan-500">EL</span>
              <span className="text-white"> SPACE</span>
            </span>
          </Link>
          
          <div className="mb-6 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-white font-semibold truncate">{userName}</p>
            <p className="text-xs text-cyan-400 font-mono">{elSpaceId}</p>
            <p className="text-xs text-slate-400 capitalize">{userType}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full px-3 py-2 text-red-400 hover:bg-slate-700 rounded-md transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
