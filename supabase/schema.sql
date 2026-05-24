-- EL SPACE Supabase Schema (Comprehensive, Idempotent & Audited)
-- This single file contains the entire database structure for EL SPACE.

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  el_space_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  user_type TEXT CHECK (user_type IN ('client', 'entrepreneur', 'business', 'enterprise', 'freelancer')) NOT NULL,
  role TEXT CHECK (role IN ('admin', 'moderator', 'user')) DEFAULT 'user',
  status TEXT DEFAULT 'active',
  avatar_url TEXT,
  bio TEXT,
  password_hash TEXT,
  transaction_pin_hash TEXT,
  id_type TEXT,
  id_serial TEXT,
  id_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_badge INTEGER DEFAULT 0,
  verified_at TIMESTAMPTZ,
  phone_number TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Freelancer Profiles
CREATE TABLE IF NOT EXISTS freelancer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  hourly_rate NUMERIC DEFAULT 0,
  years_experience INTEGER DEFAULT 0,
  portfolio_url TEXT,
  github_url TEXT,
  github_portfolio_url TEXT,
  project_links TEXT[] DEFAULT '{}',
  linkedin_url TEXT,
  skills TEXT[] DEFAULT '{}',
  bio TEXT,
  total_earnings NUMERIC DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'unavailable')) DEFAULT 'available',
  timezone TEXT,
  languages TEXT[] DEFAULT '{}',
  verified_test_project_id UUID,
  korapay_account_id TEXT,
  skills_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Client Profiles
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT,
  business_type TEXT,
  business_sector TEXT,
  business_phone TEXT,
  business_email TEXT,
  business_reg_url TEXT,
  company_name TEXT,
  company_url TEXT,
  company_size TEXT,
  budget_limit NUMERIC,
  total_spent NUMERIC DEFAULT 0,
  total_projects_posted INTEGER DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  verification_status TEXT CHECK (verification_status IN ('unverified', 'verified')) DEFAULT 'unverified',
  korapay_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_min NUMERIC NOT NULL,
  budget_max NUMERIC NOT NULL,
  total_budget NUMERIC DEFAULT 0,
  required_skills TEXT[] DEFAULT '{}',
  timeline TEXT,
  status TEXT CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'draft',
  accepted_freelancer_id UUID REFERENCES users(id),
  fixed_fee_amount NUMERIC,
  hourly_rate NUMERIC,
  estimated_hours NUMERIC,
  visibility TEXT CHECK (visibility IN ('public', 'private', 'invite-only')) DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 6. Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT NOT NULL,
  proposed_rate NUMERIC,
  estimated_days INTEGER,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  attachment_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, freelancer_id)
);

-- 7. Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'released', 'disputed', 'funded', 'completed')) DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  submission_notes TEXT,
  submission_attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance NUMERIC DEFAULT 0,
  escrow_balance NUMERIC DEFAULT 0,
  pending_balance NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  total_withdrawn NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payments & Transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  milestone_id UUID REFERENCES milestones(id),
  user_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id),
  amount NUMERIC NOT NULL,
  fee_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'escrowed')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'mobile_money', 'crypto', 'wallet')),
  payment_type TEXT CHECK (payment_type IN ('wallet_funding', 'milestone_funding', 'payout', 'withdrawal', 'internal_transfer', 'late_penalty', 'income', 'hold', 'release')),
  reference TEXT UNIQUE,
  korapay_reference TEXT UNIQUE,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Withdrawals
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  fee_amount NUMERIC DEFAULT 0,
  net_amount NUMERIC NOT NULL,
  method TEXT NOT NULL,
  account_details JSONB NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'completed', 'rejected', 'processing')) DEFAULT 'pending',
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Internal Transfers
CREATE TABLE IF NOT EXISTS internal_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  fee_amount NUMERIC DEFAULT 0,
  net_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK (status IN ('pending', 'approved', 'completed', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Deposits (Manual Funding)
CREATE TABLE IF NOT EXISTS deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  method TEXT NOT NULL,
  receipt_url TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'completed', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES users(id) NOT NULL,
  reviewee_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  visibility TEXT CHECK (visibility IN ('public', 'private')) DEFAULT 'public',
  reviewer_role TEXT CHECK (reviewer_role IN ('client', 'entrepreneur', 'business', 'enterprise', 'freelancer')) NOT NULL,
  both_submitted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Messaging
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_participants (
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment_urls TEXT[] DEFAULT '{}',
  is_system_message BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  auth TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- 16. OTP Codes
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT DEFAULT 'login',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Time Tracking
CREATE TABLE IF NOT EXISTS time_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 0,
  activity_description TEXT,
  screenshot_url TEXT,
  billable BOOLEAN DEFAULT TRUE,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  initiated_by UUID REFERENCES users(id) NOT NULL,
  initiated_against UUID REFERENCES users(id) NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('open', 'in_review', 'resolved', 'closed', 'escalated')) DEFAULT 'open',
  resolution TEXT,
  compensation_amount NUMERIC,
  compensation_to UUID REFERENCES users(id),
  escalation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  escalated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS dispute_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID REFERENCES disputes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  evidence TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mediation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID REFERENCES disputes(id) ON DELETE CASCADE NOT NULL,
  mediator_id UUID REFERENCES users(id) NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')) DEFAULT 'scheduled',
  scheduled_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mediation_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID REFERENCES disputes(id) ON DELETE CASCADE NOT NULL,
  outcome TEXT NOT NULL,
  compensation_amount NUMERIC,
  compensation_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Social Features
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  media_type TEXT CHECK (media_type IN ('image', 'video', 'none')) DEFAULT 'none',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  reposts_count INTEGER DEFAULT 0,
  original_post_id UUID REFERENCES social_posts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_likes (
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS social_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Productivity
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  remind_at TIMESTAMPTZ NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Portfolio & Assets
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  bucket_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. Saved Freelancers
CREATE TABLE IF NOT EXISTS saved_freelancers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  folder_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, freelancer_id)
);

-- 23. Row Level Security (RLS)
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON users;
CREATE POLICY "Public profiles are viewable by everyone." ON users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile." ON users;
CREATE POLICY "Users can update own profile." ON users FOR UPDATE USING (auth.uid() = id);

-- 24. RPC Functions & Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_updated_at ON %I', t);
        EXECUTE format('CREATE TRIGGER update_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t);
    END LOOP;
END $$;
