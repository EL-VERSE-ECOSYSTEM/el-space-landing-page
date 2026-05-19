"use client";
import React from 'react';

import { DashboardLayout } from "@/components/dashboard/auth-guard";
import { Briefcase, DollarSign, TrendingUp, Star, Search, Bell, Settings, FileText } from "lucide-react";
import Link from "next/link";

export default function FreelancerDashboard() {
  const navItems = [
    { label: "Dashboard", href: "/freelancer", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Find Jobs", href: "/jobs", icon: <Search className="w-5 h-5" /> },
    { label: "My Proposals", href: "/freelancer/proposals", icon: <FileText className="w-5 h-5" /> },
    { label: "My Jobs", href: "/freelancer/jobs", icon: <Briefcase className="w-5 h-5" /> },
    { label: "Earnings", href: "/earnings", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Messages", href: "/messages", icon: <Bell className="w-5 h-5" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout userType="freelancer" navItems={navItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Freelancer Dashboard</h1>
          <p className="text-slate-400">Find projects, track earnings, and grow your freelance career</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Briefcase className="w-6 h-6" />} label="Active Jobs" value="0" color="cyan" />
          <StatCard icon={<DollarSign className="w-6 h-6" />} label="Total Earnings" value="$0" color="green" />
          <StatCard icon={<Star className="w-6 h-6" />} label="Avg. Rating" value="N/A" color="amber" />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Profile Views" value="0" color="purple" />
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/jobs"
              className="flex items-center gap-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
            >
              <Search className="w-6 h-6 text-cyan-500" />
              <div>
                <p className="text-white font-medium">Browse Jobs</p>
                <p className="text-sm text-slate-400">Find your next project</p>
              </div>
            </Link>
            <Link
              href="/earnings"
              className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              <DollarSign className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-white font-medium">View Earnings</p>
                <p className="text-sm text-slate-400">Track your income</p>
              </div>
            </Link>
            <Link
              href="/freelancer/profile"
              className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors"
            >
              <Star className="w-6 h-6 text-amber-500" />
              <div>
                <p className="text-white font-medium">Edit Profile</p>
                <p className="text-sm text-slate-400">Showcase your skills</p>
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
              <p className="text-slate-300">Complete your profile with skills and portfolio</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
              <p className="text-slate-300">Browse available jobs and submit proposals</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
              <p className="text-slate-300">Get hired and start working on projects</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">4</div>
              <p className="text-slate-300">Complete milestones and receive payments</p>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recommended Jobs</h2>
            <Link href="/jobs" className="text-cyan-500 hover:text-cyan-400 text-sm">
              View all →
            </Link>
          </div>
          <div className="text-center py-12 text-slate-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No jobs available yet. Check back soon or browse all jobs.</p>
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
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6`}>
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
