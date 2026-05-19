"use client";
import React from 'react';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { INDUSTRIES, TECH_STACKS, COMPANY_SIZES, BUSINESS_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, CheckCircle, Loader, Mail, Upload, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, Zap, User, Briefcase, Rocket, Lock } from "lucide-react";
import { toast } from "sonner";
import { OTPNotification } from '@/components/ui/otp-notification';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';
import { GitHubSignInButton } from '@/components/ui/github-signin-button';
import { useAuth } from "@/components/auth-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Step management: info -> details -> otp -> complete
  const [step, setStep] = useState<"info" | "details" | "otp">("info");

  // Common fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"" | "client" | "freelancer">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Client fields
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string>("");

  // Freelancer fields
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techStackSearch, setTechStackSearch] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Phone
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");

  // OTP
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "register",
          metadata: { name, userType }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }

      if (data.otp) {
        setGeneratedOtp(data.otp);
        setShowOtpPopup(true);
      }

      setSuccess("Verification code sent to your email!");
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verify OTP
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, type: "register" }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(verifyData.message || "Failed to verify OTP");
        setLoading(false);
        return;
      }

      // Prepare registration data
      const registerData: any = {
        email,
        name,
        userType,
        password,
        phoneNumber,
        countryCode,
      };

      // Add client-specific fields
      if (userType === "client") {
        registerData.companyName = companyName || name;
        registerData.businessType = businessType;
        registerData.industry = industry;
        registerData.companySize = companySize;
        if (companyLogoPreview) {
          registerData.companyLogo = companyLogoPreview;
        }
      }

      // Add freelancer-specific fields
      if (userType === "freelancer") {
        registerData.techStack = techStack;
        registerData.aboutYou = aboutYou;
        if (profilePicturePreview) {
          registerData.profilePicture = profilePicturePreview;
        }
        if (cvFile) {
          // In production, upload to storage and get URL
          registerData.cvUrl = URL.createObjectURL(cvFile);
        }
      }

      // Register user
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const registerData_response = await registerResponse.json();

      if (!registerResponse.ok) {
        setError(registerData_response.error || "Failed to register");
        setLoading(false);
        return;
      }

      // Update auth context
      login(registerData_response.user, verifyData.token);

      setSuccess("Registration successful! Welcome aboard.");

      // Redirect based on user type
      setTimeout(() => {
        if (userType === "freelancer") {
          router.push("/dashboard/freelancer");
        } else {
          router.push("/dashboard/client");
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter: React.Dispatch<React.SetStateAction<string>>,
    accept: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(accept) && accept === "image/*") {
        toast.error("Please upload an image file");
        return;
      }
      setter(file);
      const reader = new FileReader();
      reader.onload = () => {
        previewSetter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTechStack = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else if (techStack.length < 15) {
      setTechStack([...techStack, tech]);
    } else {
      toast.error("Maximum 15 tech stacks allowed");
    }
  };

  const filteredTechStacks = TECH_STACKS.filter((tech) =>
    tech.toLowerCase().includes(techStackSearch.toLowerCase())
  ).slice(0, 20);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-3xl relative z-10 py-12">
        {/* Logo */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-xl shadow-cyan-500/20">
            <span className="text-2xl font-black text-white">EL</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Create Professional Identity</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Join the EL SPACE Network</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-center mb-8 px-8">
           <div className="flex items-center w-full max-w-md">
              {["info", "details", "otp"].map((s, i) => {
                const steps = ["info", "details", "otp"];
                const currentIndex = steps.indexOf(step);
                const isActive = i <= currentIndex;
                const isCompleted = i < currentIndex;
                return (
                  <React.Fragment key={s}>
                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-500 ${
                      isCompleted ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' :
                      isActive ? 'border-cyan-500 text-cyan-600 bg-cyan-50 shadow-md shadow-cyan-500/10' :
                      'border-slate-100 text-slate-300'
                    }`}>
                      {isCompleted ? <ShieldCheck className="w-6 h-6" /> : <span className="text-lg font-black">{i + 1}</span>}
                    </div>
                    {i < 2 && (
                      <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-500 ${
                        i < currentIndex ? 'bg-cyan-500' : 'bg-slate-100'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
           </div>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 overflow-hidden">
          {/* Status Messages */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-800 text-sm font-bold leading-tight">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-emerald-800 text-sm font-bold leading-tight">{success}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-12 h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/10 transition-all rounded-2xl font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/10 transition-all rounded-2xl font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 pr-12 h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/10 transition-all rounded-2xl font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password *</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/10 transition-all rounded-2xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Choose Account Type *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <button
                    type="button"
                    onClick={() => setUserType('client')}
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'client'
                        ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/10'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'client' ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900">Client</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hiring Talent</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('freelancer')}
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'freelancer'
                        ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/10'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'freelancer' ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900">Freelancer</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Finding Work</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-4 bg-white/80 text-slate-400 font-black uppercase tracking-[0.2em]">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <GoogleSignInButton fullWidth variant="outline" className="h-14 rounded-2xl font-bold border-2 border-slate-100" />
                <GitHubSignInButton fullWidth variant="outline" className="h-14 rounded-2xl font-bold border-2 border-slate-100" />
              </div>

              <Button
                type="button"
                onClick={() => {
                  if (!name || !email || !userType || !password) {
                    setError("Please fill in all required fields");
                    return;
                  }
                  if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    return;
                  }
                  if (password.length < 8) {
                    setError("Password must be at least 8 characters");
                    return;
                  }
                  setError("");
                  setStep("details");
                }}
                className="w-full h-16 bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg rounded-[1.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 group"
              >
                Proceed to Details
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* Step 2: Details */}
          {step === "details" && (
            <div className="space-y-6">
              <div>
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Phone Number</Label>
                <PhoneInput
                  value={phoneNumber}
                  countryCode={countryCode}
                  onPhoneChange={setPhoneNumber}
                  onCountryCodeChange={setCountryCode}
                  className="h-14"
                />
              </div>

              {/* Client Fields */}
              {userType === "client" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Name *</Label>
                    <Input
                      type="text"
                      placeholder="Acme Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Type</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-bold">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="font-bold">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Industry *</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-bold">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 max-h-[300px]">
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind} value={ind} className="font-bold">
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Size</Label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-bold">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {COMPANY_SIZES.map((size) => (
                          <SelectItem key={size} value={size} className="font-bold">
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Logo</Label>
                    <div className="flex items-center gap-6">
                      {companyLogoPreview ? (
                        <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-cyan-500/20 shadow-lg">
                          <Image src={companyLogoPreview} alt="Logo preview" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                          <Briefcase className="w-8 h-8 text-slate-300" />
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-6 text-center hover:border-cyan-500 hover:bg-cyan-50 transition-all">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload Brand Identity</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setCompanyLogo, setCompanyLogoPreview, "image/*")}
                            className="hidden"
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Freelancer Fields */}
              {userType === "freelancer" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tech Stack * (Select up to 15)</Label>
                    <Input
                      type="text"
                      placeholder="Search technologies..."
                      value={techStackSearch}
                      onChange={(e) => setTechStackSearch(e.target.value)}
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold mb-4"
                    />
                    <div className="max-h-[200px] overflow-y-auto space-y-2 bg-slate-50 rounded-[1.5rem] p-4 border border-slate-100">
                      <div className="flex flex-wrap gap-2">
                        {filteredTechStacks.map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => toggleTechStack(tech)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                              techStack.includes(tech)
                                ? "bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-500/20"
                                : "bg-white border-slate-100 text-slate-600 hover:border-purple-200"
                            )}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                    {techStack.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-100"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio *</Label>
                    <Textarea
                      placeholder="Share your expertise, achievements, and unique value proposition..."
                      value={aboutYou}
                      onChange={(e) => setAboutYou(e.target.value)}
                      rows={4}
                      className="bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold p-6 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Profile Photo</Label>
                      <div className="flex items-center gap-4">
                        {profilePicturePreview ? (
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-500/20 shadow-md">
                            <Image src={profilePicturePreview} alt="Profile preview" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                            <User className="w-6 h-6 text-slate-300" />
                          </div>
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-purple-500 hover:bg-purple-50 transition-all">
                            <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Photo</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, setProfilePicture, setProfilePicturePreview, "image/*")}
                              className="hidden"
                            />
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">CV/Resume (PDF)</Label>
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-purple-500 hover:bg-purple-50 transition-all h-[84px] flex flex-col justify-center">
                          <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate px-2">
                            {cvFile ? cvFile.name : "Select Resume"}
                          </p>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error("File size must be less than 5MB");
                                  return;
                                }
                                setCvFile(file);
                              }
                            }}
                            className="hidden"
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("info")}
                  className="flex-1 h-16 border-2 border-slate-100 text-slate-600 font-black text-lg rounded-[1.5rem] hover:bg-slate-50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (userType === "client" && !industry) {
                      setError("Please select your industry");
                      return;
                    }
                    if (userType === "freelancer" && (!techStack.length || !aboutYou)) {
                      setError("Please select tech stack and write your bio");
                      return;
                    }
                    setError("");
                    setStep("otp");
                    handleSendOTP({ preventDefault: () => {} } as any);
                  }}
                  className="flex-2 sm:flex-[2] h-16 bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg rounded-[1.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 group"
                >
                  Verify Email
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {step === "otp" && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-[2rem] text-center">
                <p className="text-slate-600 font-bold leading-relaxed">
                  Enter the 6-digit verification code sent to <br/>
                  <span className="text-cyan-600 font-black">{email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block mb-2">Security Code</Label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  required
                  className="h-20 bg-slate-50 border-slate-100 text-slate-900 text-center text-4xl tracking-[0.5em] font-black rounded-[2rem] focus:border-cyan-500 focus:ring-cyan-500/10"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-16 bg-slate-900 hover:bg-cyan-600 text-white font-black text-xl rounded-[1.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                {loading ? (
                  <span className="flex items-center gap-3 justify-center">
                    <Loader className="w-6 h-6 animate-spin" />
                    Launching Account...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Edit details
              </button>
            </form>
          )}

          <div className="mt-10 pt-10 border-t border-slate-100">
            <p className="text-center text-slate-500 font-bold text-base">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-cyan-600 hover:text-cyan-700 font-black transition-colors underline underline-offset-4 decoration-2 decoration-cyan-500/30"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">© 2026 EL VERSE TECHNOLOGIES</p>
        </div>
      </div>

      {/* OTP Notification Popup */}
      <OTPNotification
        isOpen={showOtpPopup}
        onOpenChange={setShowOtpPopup}
        otp={generatedOtp}
        email={email}
        type="register"
        showCopyButton={true}
        expiryMinutes={15}
        onOTPCopied={(code) => {
          setOtp(code);
          toast.success("Code copied! Ready to verify.");
        }}
      />
    </div>
  );
}
