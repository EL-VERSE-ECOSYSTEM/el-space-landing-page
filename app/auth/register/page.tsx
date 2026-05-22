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
import { AlertCircle, CheckCircle, Loader, Mail, Upload, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, Zap, User, Briefcase, Rocket, Lock, Building2, Globe } from "lucide-react";
import { toast } from "sonner";
import { OTPNotification } from '@/components/ui/otp-notification';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';
import { GitHubSignInButton } from '@/components/ui/github-signin-button';
import { useAuth } from "@/components/auth-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Step management: info -> details -> security -> complete
  const [step, setStep] = useState<"info" | "details" | "security">("info");

  // Common fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"" | "client" | "entrepreneur" | "business" | "enterprise" | "freelancer">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Client/Business/Entrepreneur/Enterprise fields
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessSector, setBusinessSector] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [companySize, setCompanySize] = useState("");

  // ID Verification
  const [idType, setIdType] = useState("");
  const [idSerial, setIdSerial] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idFilePreview, setIdFilePreview] = useState<string>("");
  const [businessRegFile, setBusinessRegFile] = useState<File | null>(null);
  const [businessRegFilePreview, setBusinessRegFilePreview] = useState<string>("");

  // Freelancer fields
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techStackSearch, setTechStackSearch] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState("");
  const [projectLinks, setProjectLinks] = useState<string[]>([""]);
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Security
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

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

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Prepare registration data
      const registerData: any = {
        email,
        full_name: name,
        user_type: userType,
        password,
        phoneNumber,
        countryCode,
        otp: '000000', // Mock OTP for API compatibility
      };

      // Add transaction pin
      registerData.transaction_pin = transactionPin;

      // Add ID verification fields
      registerData.id_type = idType;
      registerData.id_serial = idSerial;
      registerData.id_url = idFilePreview; // Mocking upload with preview

      // Add client/business specific fields
      if (userType !== "freelancer") {
        registerData.business_name = businessName;
        registerData.business_type = businessType;
        registerData.business_sector = businessSector;
        registerData.business_phone = businessPhone;
        registerData.business_email = businessEmail;
        registerData.business_website = businessWebsite;
        registerData.business_reg_url = businessRegFilePreview;
        registerData.company_size = companySize;
      }

      // Add freelancer-specific fields
      if (userType === "freelancer") {
        registerData.tech_stack = techStack;
        registerData.about_you = aboutYou;
        registerData.github_url = githubUrl;
        registerData.project_links = projectLinks.filter(l => l.trim() !== "");
        if (profilePicturePreview) {
          registerData.avatar_url = profilePicturePreview;
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
      login(registerData_response.user, registerData_response.token);

      setSuccess("Registration successful! Welcome aboard.");

      // Redirect based on user type
      setTimeout(() => {
        if (userType === "freelancer") {
          router.push("/freelancer/dashboard");
        } else {
          router.push("/client/dashboard");
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
              {["info", "details", "security"].map((s, i) => {
                const steps = ["info", "details", "security"];
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-nowrap">Standard Hiring</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('entrepreneur')}
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'entrepreneur'
                        ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/10'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'entrepreneur' ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm">Entrepreneur</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-nowrap">Rapid Growth</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('business')}
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'business'
                        ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/10'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'business' ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900">Business</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-nowrap">Established Org</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('enterprise')}
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'enterprise'
                        ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/10'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'enterprise' ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900">Enterprise</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-nowrap">Global Solutions</div>
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
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-nowrap">Finding Work</div>
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
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Phone Number *</Label>
                  <PhoneInput
                    value={phoneNumber}
                    countryCode={countryCode}
                    onPhoneChange={setPhoneNumber}
                    onCountryCodeChange={setCountryCode}
                    className="h-14"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Identification Type *</Label>
                  <Select value={idType} onValueChange={setIdType}>
                    <SelectTrigger className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-bold">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="passport" className="font-bold">International Passport</SelectItem>
                      <SelectItem value="national_id" className="font-bold">National ID Card</SelectItem>
                      <SelectItem value="drivers_license" className="font-bold">Driver's License</SelectItem>
                      <SelectItem value="voter_card" className="font-bold">Voter's Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ID Serial Number *</Label>
                  <Input
                    type="text"
                    placeholder="Enter ID serial number"
                    value={idSerial}
                    onChange={(e) => setIdSerial(e.target.value)}
                    className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Upload ID Document (Front) *</Label>
                  <div className="flex items-center gap-6">
                    {idFilePreview ? (
                      <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-cyan-500/20 shadow-lg">
                        <Image src={idFilePreview} alt="ID preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                        <ShieldCheck className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-6 text-center hover:border-cyan-500 hover:bg-cyan-50 transition-all">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Select ID Image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setIdFile, setIdFilePreview, "image/*")}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Client/Business/Entrepreneur Fields */}
              {userType !== "freelancer" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Name *</Label>
                    <Input
                      type="text"
                      placeholder="Legal business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Type *</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-bold">
                        <SelectValue placeholder="Select business type" />
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
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sector/Industry *</Label>
                    <Select value={businessSector} onValueChange={setBusinessSector}>
                      <SelectTrigger className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-bold">
                        <SelectValue placeholder="Select sector" />
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

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Email *</Label>
                    <Input
                      type="email"
                      placeholder="business@example.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Website Link</Label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={businessWebsite}
                        onChange={(e) => setBusinessWebsite(e.target.value)}
                        className="pl-12 h-14 bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Proof of Business Registration *</Label>
                    <div className="flex items-center gap-6">
                      {businessRegFilePreview ? (
                        <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-cyan-500/20 shadow-lg">
                          <Image src={businessRegFilePreview} alt="Reg preview" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                          <Building2 className="w-8 h-8 text-slate-300" />
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-6 text-center hover:border-cyan-500 hover:bg-cyan-50 transition-all">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload Certificate</p>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileUpload(e, setBusinessRegFile, setBusinessRegFilePreview, "*")}
                            className="hidden"
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Freelancer Fields Extension */}
              {userType === "freelancer" && (
                <div className="space-y-6 pt-4 border-t border-slate-100">
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
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">GitHub Portfolio Link</Label>
                      <Input
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Profile Photo *</Label>
                      <div className="flex items-center gap-4">
                        {profilePicturePreview ? (
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-purple-500/20 shadow-md">
                            <Image src={profilePicturePreview} alt="Profile preview" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                            <User className="w-6 h-6 text-slate-300" />
                          </div>
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-purple-500 hover:bg-purple-50 transition-all">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Image</p>
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

                    <div className="md:col-span-2 space-y-4">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Recent Projects (Links)</Label>
                      {projectLinks.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="url"
                            placeholder="https://myproject.com"
                            value={link}
                            onChange={(e) => {
                              const newLinks = [...projectLinks];
                              newLinks[index] = e.target.value;
                              setProjectLinks(newLinks);
                            }}
                            className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-bold flex-1"
                          />
                          {index === projectLinks.length - 1 && projectLinks.length < 5 && (
                            <Button
                              type="button"
                              onClick={() => setProjectLinks([...projectLinks, ""])}
                              className="h-14 w-14 rounded-2xl bg-purple-100 text-purple-600 hover:bg-purple-200"
                            >
                              +
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="md:col-span-2 space-y-2">
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
                              if (file) setCvFile(file);
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
                    // Validation
                    if (!phoneNumber || !idType || !idSerial || !idFilePreview) {
                      setError("Please fill all required verification fields");
                      return;
                    }
                    if (userType !== "freelancer" && (!businessName || !businessType || !businessSector || !businessEmail || !businessRegFilePreview)) {
                      setError("Please fill all required business fields");
                      return;
                    }
                    if (userType === "freelancer" && (!techStack.length || !aboutYou || !profilePicturePreview)) {
                      setError("Please complete your professional profile");
                      return;
                    }
                    setError("");
                    setStep("security");
                  }}
                  className="flex-2 sm:flex-[2] h-16 bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg rounded-[1.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 group"
                >
                  Security Setup
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Security */}
          {step === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="text-center space-y-2 mb-8">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Transaction Security</h3>
                  <p className="text-slate-500 font-bold text-sm">Create a 4-digit PIN for withdrawals and transfers</p>
               </div>

               <div className="max-w-xs mx-auto space-y-6">
                  <div className="space-y-2 text-center">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest block">4-Digit PIN</Label>
                    <Input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={transactionPin}
                      onChange={(e) => setTransactionPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="h-20 text-center text-4xl tracking-[1em] bg-slate-50 border-slate-100 text-slate-900 rounded-3xl font-black focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-2 text-center">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Confirm PIN</Label>
                    <Input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="h-20 text-center text-4xl tracking-[1em] bg-slate-50 border-slate-100 text-slate-900 rounded-3xl font-black focus:border-emerald-500"
                    />
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("details")}
                  className="flex-1 h-16 border-2 border-slate-100 text-slate-600 font-black text-lg rounded-[1.5rem] hover:bg-slate-50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (transactionPin.length !== 4) {
                      setError("PIN must be 4 digits");
                      return;
                    }
                    if (transactionPin !== confirmPin) {
                      setError("PINs do not match");
                      return;
                    }
                    setError("");
                    handleRegister();
                  }}
                  className="flex-2 sm:flex-[2] h-16 bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg rounded-[1.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-3 justify-center">
                      <Loader className="w-6 h-6 animate-spin" />
                      Deploying Profile...
                    </span>
                  ) : (
                    "Complete & Launch"
                  )}
                </Button>
              </div>
            </div>
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
        onVerified={() => {
          setOtp(generatedOtp);
          handleVerifyAndRegister(undefined, generatedOtp);
        }}
      />
    </div>
  );
}
