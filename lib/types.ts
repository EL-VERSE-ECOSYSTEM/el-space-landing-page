// Type definitions for the EL SPACE platform

export type UserType = 'client' | 'entrepreneur' | 'business' | 'enterprise' | 'freelancer';
export type UserRole = 'admin' | 'moderator' | 'user';
export type VerificationBadge = 0 | 1 | 2 | 3; // None, Portfolio, Test Passed, ELACCESS
export type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'released' | 'disputed';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'escrowed';
export type ReviewVisibility = 'public' | 'private';
export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

// User Interface
export interface User {
  id: string;
  el_space_id: string;
  email: string;
  name: string;
  user_type: UserType;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  id_type?: string;
  id_serial?: string;
  id_url?: string;
  is_verified: boolean;
  transaction_pin_hash?: string;
  verified_badge: VerificationBadge;
  verified_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Freelancer Profile
export interface FreelancerProfile {
  id: string;
  user_id: string;
  hourly_rate: number;
  years_experience: number;
  portfolio_url?: string;
  github_url?: string;
  github_portfolio_url?: string;
  project_links: string[];
  linkedin_url?: string;
  skills: string[];
  total_earnings: number;
  total_projects: number;
  avg_rating: number;
  total_reviews: number;
  availability_status: AvailabilityStatus;
  bio: string;
  timezone?: string;
  languages: string[];
  verified_test_project_id?: string;
  korapay_account_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Client Profile
export interface ClientProfile {
  id: string;
  user_id: string;
  business_name?: string;
  business_type?: string;
  business_sector?: string;
  business_phone?: string;
  business_email?: string;
  business_reg_url?: string;
  company_name?: string;
  company_url?: string;
  company_size?: string;
  budget_limit?: number;
  total_spent: number;
  total_projects_posted: number;
  avg_rating: number;
  total_reviews: number;
  verification_status: 'unverified' | 'verified';
  korapay_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Job/Project
export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  timeline: string;
  status: ProjectStatus;
  accepted_freelancer_id?: string;
  total_budget: number;
  fixed_fee_amount?: number;
  hourly_rate?: number;
  estimated_hours?: number;
  created_at: Date;
  updated_at: Date;
  started_at?: Date;
  completed_at?: Date;
}

// Milestone
export interface Milestone {
  id: string;
  project_id: string;
  freelancer_id: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  due_date: Date;
  submitted_at?: Date;
  approved_at?: Date;
  released_at?: Date;
  payment_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Payment/Transaction
export interface Payment {
  id: string;
  project_id?: string;
  milestone_id?: string;
  user_id: string;
  amount: number;
  fee_amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: 'card' | 'bank_transfer' | 'mobile_money' | 'crypto';
  payment_type: 'wallet_funding' | 'milestone_funding' | 'payout' | 'withdrawal';
  reference?: string;
  korapay_reference?: string;
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

// Wallet
export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

// Review
export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number; // 1-5
  comment: string;
  visibility: ReviewVisibility;
  reviewer_role: UserType;
  both_submitted: boolean;
  created_at: Date;
  updated_at: Date;
}

// Application
export interface Application {
  id: string;
  project_id: string;
  freelancer_id: string;
  cover_letter: string;
  proposed_rate?: number;
  estimated_days?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: Date;
  updated_at: Date;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_id?: string; // project_id, milestone_id, etc.
  read: boolean;
  created_at: Date;
}

// Time Log
export interface TimeLog {
  id: string;
  project_id: string;
  freelancer_id: string;
  start_time: Date;
  end_time?: Date;
  duration_minutes: number;
  activity_description: string;
  screenshot_url?: string;
  billable: boolean;
  created_at: Date;
  updated_at: Date;
}

// Dispute
export interface Dispute {
  id: string;
  project_id: string;
  initiated_by: string;
  initiated_against: string;
  reason: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  resolution?: string;
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
}

// Message
export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  attachment_urls?: string[];
  read: boolean;
  created_at: Date;
}

// Saved/Bookmarked Freelancers
export interface SavedFreelancer {
  id: string;
  client_id: string;
  freelancer_id: string;
  folder_name?: string;
  created_at: Date;
}

// Verified Test Project
export interface TestProject {
  id: string;
  freelancer_id: string;
  title: string;
  description: string;
  budget: number;
  status: 'assigned' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  submission_url?: string;
  feedback?: string;
  created_at: Date;
  updated_at: Date;
}

// Referral
export interface Referral {
  id: string;
  referrer_id: string;
  referred_user_email: string;
  referred_user_id?: string;
  referral_type: 'client' | 'freelancer';
  status: 'pending' | 'completed';
  reward_amount: number;
  created_at: Date;
  completed_at?: Date;
}
