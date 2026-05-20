"use client";
import React from 'react';

import { DashboardLayout } from "@/components/dashboard/auth-guard";
import { Briefcase, Users, DollarSign, TrendingUp, Plus, Search, Bell, Settings } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const navItems = [
    { label: "Dashboard", href: "/client", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Post a Job", href: "/client/post-job", icon: <Plus className="w-5 h-5" /> },
    { label: "My Jobs", href: "/client/jobs", icon: <Briefcase className="w-5 h-5" /> },
    { label: "Browse Talent", href: "/feed", icon: <Users className="w-5 h-5" /> },
    { label: "Messages", href: "/messages", icon: <Bell className="w-5 h-5" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout userType="client" navItems={navItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Dashboard</h1>
          <p className="text-slate-400">Manage your projects and find top talent</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Briefcase className="w-6 h-6" />} label="Active Projects" value="0" color="cyan" />
          <StatCard icon={<Users className="w-6 h-6" />} label="Freelancers Hired" value="0" color="amber" />
          <StatCard icon={<DollarSign className="w-6 h-6" />} label="Total Spent" value="$0" color="green" />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Avg. Rating" value="N/A" color="purple" />
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/client/post-job"
              className="flex items-center gap-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
            >
              <Plus className="w-6 h-6 text-cyan-500" />
              <div>
                <p className="text-white font-medium">Post a New Job</p>
                <p className="text-sm text-slate-400">Find the perfect freelancer</p>
              </div>
            </Link>
            <Link
              href="/feed"
              className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors"
            >
              <Search className="w-6 h-6 text-amber-500" />
              <div>
                <p className="text-white font-medium">Browse Talent</p>
                <p className="text-sm text-slate-400">Discover top freelancers</p>
              </div>
            </Link>
            <Link
              href="/client/jobs"
              className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              <Briefcase className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-white font-medium">View My Jobs</p>
                <p className="text-sm text-slate-400">Manage your projects</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Getting Started</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
              <p className="text-slate-300">Post your first project with detailed requirements</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
              <p className="text-slate-300">Review applications from vetted freelancers</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
              <p className="text-slate-300">Hire the best fit and fund escrow</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">4</div>
              <p className="text-slate-300">Track milestones and release payments</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const colorClasses: Record<string, string> = {
    cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-500",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-500",
    green: "bg-green-500/10 border-green-500/30 text-green-500",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-500",
  };

  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6 ${colorClasses[color] || colorClasses.cyan}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color] || colorClasses.cyan}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
