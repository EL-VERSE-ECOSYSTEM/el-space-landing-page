"use client";
import React from 'react';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [userName, setUserName] = useState("");
  const [elSpaceId, setElSpaceId] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }

    if (user) {
      setUserName(user.name || user.email);
      setElSpaceId(user.el_space_id || "EL-XXXXXXXX");
    }
  }, [user, authLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-950 via-purple-900/20 to-slate-950 border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">EL</span>
            <span className="text-white ml-2">SPACE</span>
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex gap-2 border-slate-600 text-white hover:bg-slate-800/50 hover:text-cyan-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-md rounded-lg border border-cyan-500/20 p-8 hover:border-cyan-500/40 transition-all shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to your Dashboard! 🎉
          </h2>
          <p className="text-slate-300 mb-8">Manage your freelance business and track your progress</p>
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-700/50">
            <div>
              <p className="text-slate-400 text-sm">User</p>
              <p className="text-white font-semibold text-lg">{userName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">EL SPACE ID</p>
              <p className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold text-lg">{elSpaceId}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-6 text-base shadow-lg hover:shadow-cyan-500/50 transition-all">
                  Post a Project
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-6 text-base shadow-lg hover:shadow-purple-500/50 transition-all">
                  Browse Talent
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 text-base shadow-lg hover:shadow-emerald-500/50 transition-all">
                  View My Profile
                </Button>
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Dashboard Features (Coming Soon)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all cursor-pointer">
                  <span className="text-cyan-400 text-xl">📊</span>
                  <span className="text-slate-300 font-medium">Project Management</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all cursor-pointer">
                  <span className="text-emerald-400 text-xl">💰</span>
                  <span className="text-slate-300 font-medium">Earnings Dashboard</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all cursor-pointer">
                  <span className="text-purple-400 text-xl">🎯</span>
                  <span className="text-slate-300 font-medium">Milestone Tracking</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all cursor-pointer">
                  <span className="text-blue-400 text-xl">📝</span>
                  <span className="text-slate-300 font-medium">Daily Standups</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all cursor-pointer">
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="text-slate-300 font-medium">Review System</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/30 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all cursor-pointer">
                  <span className="text-pink-400 text-xl">✓</span>
                  <span className="text-slate-300 font-medium">Verified Badge Status</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
