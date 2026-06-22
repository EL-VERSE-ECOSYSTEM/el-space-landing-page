"use client";
import Image from 'next/image';
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-foreground mt-4">Loading...</p>
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
    window.location.href = u.user_type === "freelancer" ? "/freelancer/dashboard" : "/client/dashboard";
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
  const userName = u.name || u.full_name || u.email || "User";
  const elSpaceId = u.el_space_id || "EL-XXXXXXXX";

  // Role-specific theme colors
  const activeColorClass = userType === 'client' ? 'text-success' : 'text-accent';
  const sidebarBg = 'bg-card';
  const borderClass = 'border-border';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 ${sidebarBg} border ${borderClass} rounded-md text-foreground`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 ${sidebarBg} border-r ${borderClass} z-40 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Image src="/logo.png" alt="EL SPACE" width={100} height={32} className="h-8 w-auto object-contain" />
          </Link>
          
          <div className="mb-6 p-4 bg-secondary rounded-2xl border border-border">
            <p className="text-foreground font-black truncate text-sm uppercase">{userName}</p>
            <p className={`text-[10px] font-mono font-bold ${activeColorClass}`}>{elSpaceId}</p>
            <Badge className={`mt-2 ${userType === 'client' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'} border-none text-[10px] font-black uppercase tracking-widest`}>
              {userType}
            </Badge>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-all font-bold text-sm uppercase tracking-wider"
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 p-6 border-t ${borderClass}`}>
          <button
            onClick={logout}
            className="w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all text-left font-black text-xs uppercase tracking-widest"
          >
            Terminal Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen relative">
         <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className={`absolute -top-24 -left-24 w-96 h-96 ${userType === 'client' ? 'bg-success/5' : 'bg-accent/5'} rounded-full blur-[100px]`} />
            <div className={`absolute top-1/2 -right-24 w-[500px] h-[500px] ${userType === 'client' ? 'bg-success/5' : 'bg-accent/5'} rounded-full blur-[120px]`} />
         </div>
        <div className="p-6 lg:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
