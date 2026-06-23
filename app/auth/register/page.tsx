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
import { AlertCircle, CheckCircle, Loader, Mail, Upload, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, Zap, User, Briefcase, Rocket, Lock, Building2, Globe, FileText } from "lucide-react";
import { toast } from "sonner";
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
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"" | "client" | "entrepreneur" | "business" | "enterprise" | "freelancer">("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (val: string) => {
    setEmail(val);
    if (!val) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(val)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const checkPasswordStrength = (pass: string) => {
    setPassword(pass);
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    setPasswordStrength(strength);
  };

  const validateConfirmPassword = (val: string) => {
    setConfirmPassword(val);
    if (val !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

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

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden text-foreground">
      {/* Premium Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-3xl relative z-10 py-12">
        {/* Logo */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary via-slate-500 to-slate600 shadow-xl shadow-primary/20">
            <span className="text-2xl font-black text-white">EL</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">Create Professional Identity</h1>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Join the EL SPACE Network</p>
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
                      isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' :
                      isActive ? 'bg-primary/10 border-primary text-primary shadow-md shadow-primary/10' :
                      'border-border text-muted-foreground'
                    }`}>
                      {isCompleted ? <ShieldCheck className="w-6 h-6" /> : <span className="text-lg font-black">{i + 1}</span>}
                    </div>
                    {i < 2 && (
                      <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-500 ${
                        i < currentIndex ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
           </div>
        </div>

        {/* Card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-primary/5 overflow-hidden">
          {/* Status Messages */}
          {error && (
            <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-destructive text-sm font-bold leading-tight">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-8 p-4 bg-success/10 border border-success/20 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-success text-sm font-bold leading-tight">{success}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-12 h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/10 transition-all rounded-2xl font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => validateEmail(e.target.value)}
                      required
                      className={cn(
                        "pl-12 h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/10 transition-all rounded-2xl font-bold",
                        emailError && "border-destructive focus:border-destructive focus:ring-destructive/10"
                      )}
                    />
                  </div>
                  {emailError && <p className="text-[10px] font-bold text-destructive ml-1">{emailError}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 chars"
                      value={password}
                      onChange={(e) => checkPasswordStrength(e.target.value)}
                      required
                      className="pl-12 pr-12 h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/10 transition-all rounded-2xl font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="space-y-1">
                      <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-muted">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div
                            key={s}
                            className={cn(
                              "flex-1 transition-all duration-500",
                              s <= passwordStrength
                                ? passwordStrength <= 2
                                  ? "bg-destructive"
                                  : passwordStrength <= 4
                                  ? "bg-slate500"
                                  : "bg-success"
                                : "bg-transparent"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Strength: {
                          passwordStrength <= 2 ? "Weak" :
                          passwordStrength <= 4 ? "Medium" : "Strong"
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Confirm Password *</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => validateConfirmPassword(e.target.value)}
                    required
                    className={cn(
                      "h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/10 transition-all rounded-2xl font-bold",
                      confirmPasswordError && "border-destructive focus:border-destructive focus:ring-destructive/10"
                    )}
                  />
                  {confirmPasswordError && <p className="text-[10px] font-bold text-destructive ml-1">{confirmPasswordError}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Choose Account Type *</Label>
                  <p className="text-[11px] text-muted-foreground font-bold ml-1 mb-4">Select the account type that best fits your needs to personalize your experience.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   <button
                    type="button"
                    onClick={() => setUserType('client')}
                    aria-label="Client account for standard hiring"
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'client'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-border bg-muted/50 hover:border-primary/50'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'client' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-foreground uppercase text-xs">Client</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-nowrap">Standard Hiring Account</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('entrepreneur')}
                    aria-label="Entrepreneur account for rapid growth"
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'entrepreneur'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-border bg-muted/50 hover:border-primary/50'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'entrepreneur' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-foreground text-xs uppercase">Entrepreneur</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-nowrap">High-Growth Ventures</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('business')}
                    aria-label="Business account for established organizations"
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'business'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-border bg-muted/50 hover:border-primary/50'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'business' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-foreground uppercase text-xs">Business</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-nowrap">Professional Organizations</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('enterprise')}
                    aria-label="Enterprise account for global solutions"
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'enterprise'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-border bg-muted/50 hover:border-primary/50'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'enterprise' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-foreground uppercase text-xs">Enterprise</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-nowrap">Enterprise Grade Scale</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('freelancer')}
                    aria-label="Freelancer account for finding work"
                    className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      userType === 'freelancer'
                        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
                        : 'border-border bg-muted/50 hover:border-accent/50'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      userType === 'freelancer' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-foreground uppercase text-xs">Freelancer</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-nowrap">Professional Freelance Profile</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-4 bg-card text-muted-foreground font-black uppercase tracking-[0.2em]">or continue with</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <GoogleSignInButton fullWidth variant="outline" className="h-14 rounded-2xl font-bold border-2 border-border" />
                  <GitHubSignInButton fullWidth variant="outline" className="h-14 rounded-2xl font-bold border-2 border-border" />
                </div>
                <p className="text-[9px] text-center text-muted-foreground font-black uppercase tracking-widest">
                  We only access your public profile and email address
                </p>
              </div>

              <Button
                type="button"
                onClick={() => {
                  if (!name || !email || !userType || !password) {
                    setError("Please fill in all required fields");
                    return;
                  }
                  if (emailError) {
                    setError("Please enter a valid email address");
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
                className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-[1.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 group"
              >
                Verify Identity
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* Step 2: Details */}
          {step === "details" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="text-center space-y-2 mb-4">
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Identity & Professional Setup</h3>
                  <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Complete your profile to unlock full platform capabilities</p>
               </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 mb-2 block">Phone Number * (Include country code)</Label>
                  <PhoneInput
                    value={phoneNumber}
                    countryCode={countryCode}
                    onPhoneChange={setPhoneNumber}
                    onCountryCodeChange={setCountryCode}
                    className="h-14"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Official Government ID *</Label>
                  <Select value={idType} onValueChange={setIdType}>
                    <SelectTrigger className="h-14 bg-muted border-border text-foreground rounded-2xl font-bold">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="passport" className="font-bold">International Passport</SelectItem>
                      <SelectItem value="national_id" className="font-bold">National ID Card</SelectItem>
                      <SelectItem value="drivers_license" className="font-bold">Driver's License</SelectItem>
                      <SelectItem value="voter_card" className="font-bold">Voter's Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">ID Serial Number *</Label>
                  <Input
                    type="text"
                    placeholder="Enter ID serial number"
                    value={idSerial}
                    onChange={(e) => setIdSerial(e.target.value)}
                    className="h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 rounded-2xl font-bold"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Upload ID Document (Valid Passport or Driver License) *</Label>
                  <div className="flex items-center gap-6">
                    {idFilePreview ? (
                      <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-lg">
                        <Image src={idFilePreview} alt="ID preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                        <ShieldCheck className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-[1.5rem] p-6 text-center hover:border-primary hover:bg-primary/5 transition-all">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Select ID Image</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Business Name *</Label>
                    <Input
                      type="text"
                      placeholder="Legal business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 rounded-2xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Business Type *</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger className="h-14 bg-muted border-border text-foreground rounded-2xl font-bold">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="font-bold">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Sector/Industry *</Label>
                    <Select value={businessSector} onValueChange={setBusinessSector}>
                      <SelectTrigger className="h-14 bg-muted border-border text-foreground rounded-2xl font-bold">
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-[300px]">
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind} value={ind} className="font-bold">
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Company Size</Label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger className="h-14 bg-muted border-border text-foreground rounded-2xl font-bold">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {COMPANY_SIZES.map((size) => (
                          <SelectItem key={size} value={size} className="font-bold">
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Business Email *</Label>
                    <Input
                      type="email"
                      placeholder="business@example.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 rounded-2xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Business Website Link</Label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={businessWebsite}
                        onChange={(e) => setBusinessWebsite(e.target.value)}
                        className="pl-12 h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 rounded-2xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Proof of Business Registration (Optional)</Label>
                    <div className="flex items-center gap-6">
                      {businessRegFilePreview ? (
                        <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-lg flex items-center justify-center bg-muted">
                          {businessRegFile?.type === "application/pdf" ? (
                             <FileText className="w-10 h-10 text-primary" />
                          ) : (
                             <Image src={businessRegFilePreview} alt="Reg preview" fill className="object-cover" />
                          )}
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                          <Building2 className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-border rounded-[1.5rem] p-6 text-center hover:border-primary hover:bg-primary/5 transition-all">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Upload (Image, PDF, DOC)</p>
                          <input
                            type="file"
                            accept="image/*,application/pdf,.doc,.docx"
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
                <div className="space-y-6 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Key Expertise & Tech Stack *</Label>
                    <Input
                      type="text"
                      placeholder="Search technologies..."
                      value={techStackSearch}
                      onChange={(e) => setTechStackSearch(e.target.value)}
                      className="h-14 bg-muted border-border text-foreground placeholder:text-muted-foreground/50 rounded-2xl font-bold mb-4"
                    />
                    <div className="max-h-[200px] overflow-y-auto space-y-2 bg-muted/30 rounded-[1.5rem] p-4 border border-border">
                      <div className="flex flex-wrap gap-2">
                        {filteredTechStacks.map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => toggleTechStack(tech)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                              techStack.includes(tech)
                                ? "bg-accent border-accent text-accent-foreground shadow-md shadow-accent/20"
                                : "bg-card border-border text-muted-foreground hover:border-accent/50"
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
                            className="px-3 py-1 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest rounded-full border border-accent/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Professional Summary / Bio *</Label>
                    <Textarea
                      placeholder="Share your expertise, achievements, and unique value proposition..."
                      value={aboutYou}
                      onChange={(e) => setAboutYou(e.target.value)}
                      rows={4}
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50 rounded-2xl font-bold p-6 focus:border-accent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">GitHub Portfolio Link</Label>
                      <Input
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="h-14 bg-muted border-border text-foreground rounded-2xl font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Profile Photo *</Label>
                      <div className="flex items-center gap-4">
                        {profilePicturePreview ? (
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-accent/20 shadow-md">
                            <Image src={profilePicturePreview} alt="Profile preview" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                            <User className="w-6 h-6 text-muted-foreground/30" />
                          </div>
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="border-2 border-dashed border-border rounded-2xl p-4 text-center hover:border-accent hover:bg-accent/5 transition-all">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Select Image</p>
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
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Recent Projects (Links)</Label>
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
                            className="h-14 bg-muted border-border text-foreground rounded-2xl font-bold flex-1"
                          />
                          {index === projectLinks.length - 1 && projectLinks.length < 5 && (
                            <Button
                              type="button"
                              onClick={() => setProjectLinks([...projectLinks, ""])}
                              className="h-14 w-14 rounded-2xl bg-accent/10 text-accent hover:bg-accent/20"
                            >
                              +
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">CV/Resume (PDF)</Label>
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-border rounded-2xl p-4 text-center hover:border-accent hover:bg-accent/5 transition-all h-[84px] flex flex-col justify-center">
                          <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate px-2">
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
                  className="flex-1 h-16 border-2 border-border text-foreground font-black text-lg rounded-[1.5rem] hover:bg-muted"
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
                    if (userType !== "freelancer" && (!businessName || !businessType || !businessSector || !businessEmail)) {
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
                  className="flex-2 sm:flex-[2] h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-[1.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 group"
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
                  <div className="w-20 h-20 bg-slate-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-slate-500/20">
                    <ShieldCheck className="w-10 h-10 text-slate500" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Transaction Security</h3>
                  <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Secure your account with a 4-digit Transaction PIN</p>
               </div>

               <div className="max-w-xs mx-auto space-y-6">
                  <div className="space-y-2 text-center">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">4-Digit PIN</Label>
                    <Input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={transactionPin}
                      onChange={(e) => setTransactionPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="h-20 text-center text-4xl tracking-[1em] bg-muted border-border text-foreground rounded-3xl font-black focus:border-success"
                    />
                  </div>

                  <div className="space-y-2 text-center">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Confirm PIN</Label>
                    <Input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="h-20 text-center text-4xl tracking-[1em] bg-muted border-border text-foreground rounded-3xl font-black focus:border-success"
                    />
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("details")}
                  className="flex-1 h-16 border-2 border-border text-foreground font-black text-lg rounded-[1.5rem] hover:bg-muted"
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
                  className="flex-2 sm:flex-[2] h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-[1.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
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


          <div className="mt-10 pt-10 border-t border-border">
            <p className="text-center text-muted-foreground font-bold text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/80 font-black transition-colors underline underline-offset-4 decoration-2 decoration-primary/30"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">© 2026 EL SPACE. A product of EL VERSE TECHNOLOGIES.</p>
        </div>
      </div>

    </div>
  );
}
