"use client";
import React from 'react';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AlertCircle, CheckCircle, Loader, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { GoogleSignInButton } from "@/components/ui/google-signin-button";
import { GitHubSignInButton } from "@/components/ui/github-signin-button";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Step management: email -> password
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState<any>(null);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate email format or EL Space ID format
      const isEmail = email.includes('@');
      const isSpaceId = /^[A-Z]{3}[0-9]{7}$/.test(email.toUpperCase());

      if (!isEmail && !isSpaceId) {
        setError("Please enter a valid email or EL Space ID (e.g., ELS1234567)");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok || !data.exists) {
        setError("No account found with this email. Please register first.");
        setLoading(false);
        return;
      }

      setUserData(data.user);
      setSuccess("Account verified! Please enter your password.");
      setStep("password");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      setSuccess("Login successful!");

      // Update auth context
      await login(data.user, data.token || 'temp-token');

      // Redirect based on user type
      setTimeout(() => {
        if (data.user?.user_type === "freelancer" || data.user?.role === "freelancer") {
          router.push("/freelancer/dashboard");
        } else if (data.user?.user_type === "client" || data.user?.role === "client") {
          router.push("/client/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden text-foreground">
      {/* Premium Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-slate-500/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-400/10 rounded-full blur-[140px] animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-slate-800 via-slate-500 to-slate-400 shadow-xl shadow-primary/20">
            <span className="text-2xl font-black text-white">EL</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-foreground mb-2 tracking-tighter uppercase">Secure Sign In</h1>
            <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px]">Premium Authentication Node</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-center mb-8 px-8">
           <div className="flex items-center w-full max-w-[240px]">
              {["email", "password"].map((s, i) => {
                const steps = ["email", "password"];
                const currentIndex = steps.indexOf(step);
                const isActive = i <= currentIndex;
                const isCompleted = i < currentIndex;
                return (
                  <React.Fragment key={s}>
                    <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                      isCompleted ? 'bg-slate-700 border-slate-700 text-slate-700-foreground' :
                      isActive ? 'border-slate-700 text-slate-700 bg-slate-700/10' :
                      'border-border text-muted-foreground'
                    }`}>
                      {isCompleted ? <ShieldCheck className="w-5 h-5" /> : <span className="text-sm font-black">{i + 1}</span>}
                    </div>
                    {i < 1 && (
                      <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                        i < currentIndex ? 'bg-slate-700' : 'bg-muted'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
           </div>
        </div>

        {/* Card */}
        <div className="bg-card/40 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-primary/5 overflow-hidden">
          {/* Status Messages */}
          {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-destructive text-sm font-bold leading-tight">{error}</p>
            </div>
          )}

          {success && (
          <div className="mb-6 p-4 bg-slate-500/10 border border-slate-500/20 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <p className="text-slate-500 text-sm font-bold leading-tight">{success}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleCheckEmail} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Email or EL Space ID</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30" />
                  <Input
                    type="text"
                    placeholder="you@example.com or ELS1234567"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-14 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all rounded-2xl font-bold"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full h-16 bg-slate-700 hover:bg-slate-700/90 text-slate-700-foreground font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl shadow-primary/20 group"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying Identity...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-4 bg-card/80 text-muted-foreground font-black uppercase tracking-[0.2em]">or social login</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <GoogleSignInButton fullWidth variant="outline" className="h-14 rounded-2xl font-bold border-2 border-border" />
                <GitHubSignInButton fullWidth variant="outline" className="h-14 rounded-2xl font-bold border-2 border-border" />
              </div>
            </form>
          )}

          {/* Step 2: Password */}
          {step === "password" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="bg-muted p-4 rounded-2xl text-center mb-2">
                <p className="text-sm font-bold text-muted-foreground">
                  Signing in as <span className="text-slate-700">{email}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-4 pr-12 h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 focus:border-slate-700 focus:ring-primary/10 transition-all rounded-2xl font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full h-14 bg-slate-700 hover:bg-slate-700/90 text-slate-700-foreground font-black text-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ShieldCheck className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setPassword("");
                  setError("");
                  setSuccess("");
                }}
                className="w-full py-2 text-sm font-bold text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Change email address
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-center text-muted-foreground font-bold text-sm">
              New to the platform?{" "}
              <Link
                href="/auth/register"
                className="text-slate-700 hover:text-slate-700/80 font-black transition-colors underline underline-offset-4 decoration-2 decoration-primary/30"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">© 2026 EL SPACE. A product of EL VERSE TECHNOLOGIES.</p>
        </div>
      </div>

    </div>
  );
}
