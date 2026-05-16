"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut, Rocket, Briefcase, User, ChevronRight, Zap, Target, Star, ShieldCheck } from "lucide-react";
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [userName, setUserName] = useState("");
  const [elSpaceId, setElSpaceId] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Environment</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              EL
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent tracking-tight">SPACE</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
               <p className="text-sm font-black text-slate-900">{userName}</p>
               <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">{elSpaceId}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex gap-2 text-slate-500 font-bold hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 space-y-12">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white overflow-hidden shadow-2xl">
             <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-cyan-400 font-black text-[10px] uppercase tracking-[0.2em]">
                   <Zap className="w-3 h-3 fill-cyan-400" /> Premium Access
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  Welcome back,<br/>
                  <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">{userName.split(' ')[0]}!</span> 🎉
                </h2>
                <p className="text-slate-400 text-lg font-medium max-w-md">Your workspace is ready. Let&apos;s build something extraordinary today.</p>
             </div>

             <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-sm">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Projects</p>
                   <p className="text-3xl font-black">04</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-sm">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Earnings</p>
                   <p className="text-3xl font-black text-emerald-400">$0</p>
                </div>
             </div>

             {/* Decorative */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight ml-2">Accelerate Your Workflow</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Post a Project', icon: Rocket, color: 'cyan', link: '/jobs/post' },
                { label: 'Browse Talent', icon: Briefcase, color: 'purple', link: '/freelancers' },
                { label: 'Manage Profile', icon: User, color: 'blue', link: '/settings' }
              ].map((action, i) => (
                <Link key={i} href={action.link} className="group">
                  <div className={`h-full p-8 rounded-[2.5rem] border-2 border-slate-50 bg-white hover:border-${action.color}-500/20 hover:shadow-2xl hover:shadow-${action.color}-500/5 transition-all duration-500`}>
                     <div className={`w-14 h-14 rounded-2xl bg-${action.color}-50 text-${action.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-7 h-7" />
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-slate-900">{action.label}</span>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-2 transition-transform" />
                     </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Features / Coming Soon */}
          <div className="space-y-6">
             <div className="flex items-center justify-between ml-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ecosystem Intelligence</h3>
                <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest">Roadmap 2026</span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Project AI', icon: Target, desc: 'Automated milestone generation', color: 'bg-emerald-50 text-emerald-600' },
                  { title: 'Smart Escrow', icon: ShieldCheck, desc: 'Instant multi-currency release', color: 'bg-cyan-50 text-cyan-600' },
                  { title: 'Talent Scores', icon: Star, desc: 'Verified behavioral metrics', color: 'bg-amber-50 text-amber-600' },
                  { title: 'Rapid Hires', icon: Zap, desc: 'Match to hire in under 4h', color: 'bg-purple-50 text-purple-600' }
                ].map((feat, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] border border-slate-100 bg-white/50 backdrop-blur-sm relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all">
                     <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-6`}>
                        <feat.icon className="w-6 h-6" />
                     </div>
                     <h4 className="font-black text-slate-900 mb-2">{feat.title}</h4>
                     <p className="text-xs font-bold text-slate-500 leading-relaxed">{feat.desc}</p>
                     <div className="absolute bottom-0 right-0 w-24 h-24 bg-slate-50 rounded-tl-[3rem] -mb-12 -mr-12 group-hover:scale-150 transition-transform duration-700" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
