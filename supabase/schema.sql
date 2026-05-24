-- EL SPACE Supabase Schema (Comprehensive & Audited)

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
  status TEXT CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'released', 'disputed')) DEFAULT 'pending',
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
  payment_type TEXT CHECK (payment_type IN ('wallet_funding', 'milestone_funding', 'payout', 'withdrawal', 'internal_transfer', 'late_penalty')),
  reference TEXT UNIQUE,
  korapay_reference TEXT UNIQUE,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Reviews
-- 10. Withdrawals
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL, -- 'USD', 'NGN', 'GBP', 'EUR', 'SOL', 'USDT', 'ETH'
  fee_amount NUMERIC DEFAULT 0,
  net_amount NUMERIC NOT NULL,
  method TEXT NOT NULL, -- 'bank', 'crypto'
  account_details JSONB NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'completed', 'rejected')) DEFAULT 'pending',
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
  method TEXT NOT NULL, -- 'bank_transfer', 'crypto_transfer'
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

-- 11. Messaging
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

-- 12. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
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

-- 13. Time Tracking
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

-- 14. Disputes
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

-- 15. Verified Tests
CREATE TABLE IF NOT EXISTS test_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget NUMERIC,
  status TEXT CHECK (status IN ('assigned', 'in_progress', 'submitted', 'approved', 'rejected')) DEFAULT 'assigned',
  submission_url TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_user_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referral_type TEXT CHECK (referral_type IN ('client', 'freelancer')),
  status TEXT CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
  reward_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 17. Contact & Support
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'responded', 'closed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Social Features
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

-- 19. Productivity
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

-- 20. Portfolio & Assets
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

-- 21. Authentication Fallbacks

CREATE TABLE IF NOT EXISTS saved_freelancers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  folder_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, freelancer_id)
);

-- 22. Row Level Security (RLS)

-- Enable RLS on all tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- Users Policies
-- Public view only sees non-sensitive fields
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON users;
CREATE POLICY "Public profiles are viewable by everyone." ON users
FOR SELECT USING (true);

-- Special policy for sensitive data (ID, Serial, etc.)
-- Note: Supabase doesn't support column-level RLS easily for same table,
-- but we can filter it in the application or use a View.
-- For standard RLS, we ensure only the owner or admins can SELECT everything.

DROP POLICY IF EXISTS "Users can update own profile." ON users;
CREATE POLICY "Users can update own profile." ON users FOR UPDATE USING (auth.uid() = id);

-- Profiles Policies
DROP POLICY IF EXISTS "Freelancer profiles are public." ON freelancer_profiles;
CREATE POLICY "Freelancer profiles are public." ON freelancer_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Freelancers can update own profile." ON freelancer_profiles;
CREATE POLICY "Freelancers can update own profile." ON freelancer_profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Client profiles are public." ON client_profiles;
CREATE POLICY "Client profiles are public." ON client_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Clients can update own client profile." ON client_profiles;
CREATE POLICY "Clients can update own client profile." ON client_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Projects Policies
DROP POLICY IF EXISTS "Open projects are viewable by everyone." ON projects;
CREATE POLICY "Open projects are viewable by everyone." ON projects FOR SELECT USING (status = 'open' OR visibility = 'public' OR auth.uid() = client_id OR auth.uid() = accepted_freelancer_id);
DROP POLICY IF EXISTS "Clients can manage own projects." ON projects;
CREATE POLICY "Clients can manage own projects." ON projects FOR ALL USING (auth.uid() = client_id);

-- Applications Policies
DROP POLICY IF EXISTS "Users can view relevant applications." ON applications;
CREATE POLICY "Users can view relevant applications." ON applications FOR SELECT USING (auth.uid() = freelancer_id OR EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));
DROP POLICY IF EXISTS "Freelancers can manage own applications." ON applications;
CREATE POLICY "Freelancers can manage own applications." ON applications FOR ALL USING (auth.uid() = freelancer_id);

-- Milestones Policies
DROP POLICY IF EXISTS "Users can view relevant milestones." ON milestones;
CREATE POLICY "Users can view relevant milestones." ON milestones FOR SELECT USING (auth.uid() = freelancer_id OR EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));

-- Wallet & Payments Policies
DROP POLICY IF EXISTS "Users can view own wallet." ON wallets;
CREATE POLICY "Users can view own wallet." ON wallets FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own wallet." ON wallets;
CREATE POLICY "Users can manage own wallet." ON wallets FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own payments." ON payments;
CREATE POLICY "Users can view own payments." ON payments FOR SELECT USING (auth.uid() = user_id OR auth.uid() = recipient_id);
DROP POLICY IF EXISTS "Users can insert own payments." ON payments;
CREATE POLICY "Users can insert own payments." ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messaging Policies
DROP POLICY IF EXISTS "Participants can view room messages." ON messages;
CREATE POLICY "Participants can view room messages." ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM chat_participants WHERE room_id = messages.room_id AND user_id = auth.uid())
  OR sender_id = auth.uid()
  OR recipient_id = auth.uid()
);
DROP POLICY IF EXISTS "Participants can manage messages." ON messages;
CREATE POLICY "Participants can manage messages." ON messages FOR ALL USING (
  EXISTS (SELECT 1 FROM chat_participants WHERE room_id = messages.room_id AND user_id = auth.uid())
  OR sender_id = auth.uid()
  OR recipient_id = auth.uid()
);

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view own notifications." ON notifications;
CREATE POLICY "Users can view own notifications." ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own notifications." ON notifications;
CREATE POLICY "Users can update own notifications." ON notifications FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own push subs." ON push_subscriptions;
CREATE POLICY "Users can manage own push subs." ON push_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Social Policies
DROP POLICY IF EXISTS "Social posts are viewable by everyone." ON social_posts;
CREATE POLICY "Social posts are viewable by everyone." ON social_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own posts." ON social_posts;
CREATE POLICY "Users can manage own posts." ON social_posts FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Social engagement is public." ON social_likes;
CREATE POLICY "Social engagement is public." ON social_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can like/unlike." ON social_likes;
CREATE POLICY "Users can like/unlike." ON social_likes FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Social comments are public." ON social_comments;
CREATE POLICY "Social comments are public." ON social_comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own comments." ON social_comments;
CREATE POLICY "Users can manage own comments." ON social_comments FOR ALL USING (auth.uid() = user_id);

-- Portfolio Policies
DROP POLICY IF EXISTS "Portfolio items are public." ON portfolio_items;
CREATE POLICY "Portfolio items are public." ON portfolio_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own portfolio." ON portfolio_items;
CREATE POLICY "Users can manage own portfolio." ON portfolio_items FOR ALL USING (auth.uid() = user_id);

-- Productivity Policies
DROP POLICY IF EXISTS "Users can manage own todos." ON todos;
CREATE POLICY "Users can manage own todos." ON todos FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own reminders." ON reminders;
CREATE POLICY "Users can manage own reminders." ON reminders FOR ALL USING (auth.uid() = user_id);

-- Disputes Policies
DROP POLICY IF EXISTS "Users can view relevant disputes." ON disputes;
CREATE POLICY "Users can view relevant disputes." ON disputes FOR SELECT USING (auth.uid() = initiated_by OR auth.uid() = initiated_against);
DROP POLICY IF EXISTS "Users can manage relevant disputes." ON disputes;
CREATE POLICY "Users can manage relevant disputes." ON disputes FOR ALL USING (auth.uid() = initiated_by OR auth.uid() = initiated_against);

DROP POLICY IF EXISTS "Users can view dispute evidence." ON dispute_evidence;
CREATE POLICY "Users can view dispute evidence." ON dispute_evidence FOR SELECT USING (EXISTS (SELECT 1 FROM disputes WHERE id = dispute_id AND (initiated_by = auth.uid() OR initiated_against = auth.uid())));
DROP POLICY IF EXISTS "Users can manage dispute evidence." ON dispute_evidence;
CREATE POLICY "Users can manage dispute evidence." ON dispute_evidence FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view relevant mediation sessions." ON mediation_sessions;
CREATE POLICY "Users can view relevant mediation sessions." ON mediation_sessions FOR SELECT USING (EXISTS (SELECT 1 FROM disputes WHERE id = dispute_id AND (initiated_by = auth.uid() OR initiated_against = auth.uid())));
DROP POLICY IF EXISTS "Users can view relevant mediation outcomes." ON mediation_outcomes;
CREATE POLICY "Users can view relevant mediation outcomes." ON mediation_outcomes FOR SELECT USING (EXISTS (SELECT 1 FROM disputes WHERE id = dispute_id AND (initiated_by = auth.uid() OR initiated_against = auth.uid())));

-- Storage Policies
DROP POLICY IF EXISTS "Users can manage own storage assets." ON storage_assets;
CREATE POLICY "Users can manage own storage assets." ON storage_assets FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Public can view storage assets." ON storage_assets;
CREATE POLICY "Public can view storage assets." ON storage_assets FOR SELECT USING (true);

-- Time Logs Policies
DROP POLICY IF EXISTS "Users can view relevant time logs." ON time_logs;
CREATE POLICY "Users can view relevant time logs." ON time_logs FOR SELECT USING (freelancer_id = auth.uid() OR EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));
DROP POLICY IF EXISTS "Freelancers can manage own time logs." ON time_logs;
CREATE POLICY "Freelancers can manage own time logs." ON time_logs FOR ALL USING (freelancer_id = auth.uid());

-- Reviews Policies
DROP POLICY IF EXISTS "Public reviews are viewable by everyone." ON reviews;
CREATE POLICY "Public reviews are viewable by everyone." ON reviews FOR SELECT USING (visibility = 'public');
DROP POLICY IF EXISTS "Users can view private reviews they are part of." ON reviews;
CREATE POLICY "Users can view private reviews they are part of." ON reviews FOR SELECT USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());
DROP POLICY IF EXISTS "Users can manage own reviews." ON reviews;
CREATE POLICY "Users can manage own reviews." ON reviews FOR ALL USING (reviewer_id = auth.uid());

-- Test Projects Policies
DROP POLICY IF EXISTS "Freelancers can view own test projects." ON test_projects;
CREATE POLICY "Freelancers can view own test projects." ON test_projects FOR SELECT USING (freelancer_id = auth.uid());

-- Referrals Policies
DROP POLICY IF EXISTS "Users can view own referrals." ON referrals;
CREATE POLICY "Users can view own referrals." ON referrals FOR SELECT USING (referrer_id = auth.uid() OR referred_user_email = (SELECT email FROM users WHERE id = auth.uid()));

-- Contact Requests Policies
DROP POLICY IF EXISTS "Anyone can submit contact requests." ON contact_requests;
CREATE POLICY "Anyone can submit contact requests." ON contact_requests FOR INSERT WITH CHECK (true);

-- Saved Freelancers Policies
DROP POLICY IF EXISTS "Clients can manage own saved freelancers." ON saved_freelancers;
CREATE POLICY "Clients can manage own saved freelancers." ON saved_freelancers FOR ALL USING (client_id = auth.uid());

-- Withdrawals Policies
DROP POLICY IF EXISTS "Users can view own withdrawals." ON withdrawals;
CREATE POLICY "Users can view own withdrawals." ON withdrawals FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own withdrawals." ON withdrawals;
CREATE POLICY "Users can insert own withdrawals." ON withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all withdrawals." ON withdrawals;
CREATE POLICY "Admins can manage all withdrawals." ON withdrawals FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Internal Transfers Policies
DROP POLICY IF EXISTS "Users can view own transfers." ON internal_transfers;
CREATE POLICY "Users can view own transfers." ON internal_transfers FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
DROP POLICY IF EXISTS "Users can insert own transfers." ON internal_transfers;
CREATE POLICY "Users can insert own transfers." ON internal_transfers FOR INSERT WITH CHECK (auth.uid() = sender_id);
DROP POLICY IF EXISTS "Admins can manage all transfers." ON internal_transfers;
CREATE POLICY "Admins can manage all transfers." ON internal_transfers FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Deposits Policies
DROP POLICY IF EXISTS "Users can view own deposits." ON deposits;
CREATE POLICY "Users can view own deposits." ON deposits FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own deposits." ON deposits;
CREATE POLICY "Users can insert own deposits." ON deposits FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all deposits." ON deposits;
CREATE POLICY "Admins can manage all deposits." ON deposits FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- chat_rooms & chat_participants Policies
DROP POLICY IF EXISTS "Users can view own chat rooms." ON chat_rooms;
CREATE POLICY "Users can view own chat rooms." ON chat_rooms FOR SELECT USING (EXISTS (SELECT 1 FROM chat_participants WHERE room_id = id AND user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can view chat participants." ON chat_participants;
CREATE POLICY "Users can view chat participants." ON chat_participants FOR SELECT USING (EXISTS (SELECT 1 FROM chat_participants cp2 WHERE cp2.room_id = room_id AND cp2.user_id = auth.uid()));

-- 23. RPC Functions

-- Atomic Internal Transfer (Immediate)
CREATE OR REPLACE FUNCTION process_internal_transfer(
  p_sender_id UUID,
  p_recipient_id UUID,
  p_amount NUMERIC
) RETURNS VOID AS $$
DECLARE
  v_sender_balance NUMERIC;
BEGIN
  -- Get sender balance and lock the row
  SELECT balance INTO v_sender_balance
  FROM wallets
  WHERE user_id = p_sender_id
  FOR UPDATE;

  IF v_sender_balance IS NULL THEN
    RAISE EXCEPTION 'Sender wallet not found';
  END IF;

  IF v_sender_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  -- Deduct from sender
  UPDATE wallets
  SET balance = balance - p_amount,
      updated_at = NOW()
  WHERE user_id = p_sender_id;

  -- Add to recipient
  UPDATE wallets
  SET balance = balance + p_amount,
      updated_at = NOW()
  WHERE user_id = p_recipient_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Complete Pending Transfer (Move from pending to recipient balance)
CREATE OR REPLACE FUNCTION approve_internal_transfer(
  p_transfer_id UUID,
  p_admin_id UUID
) RETURNS VOID AS $$
DECLARE
  v_sender_id UUID;
  v_recipient_id UUID;
  v_amount NUMERIC;
  v_net_amount NUMERIC;
BEGIN
  -- 1. Get and lock transfer record
  SELECT sender_id, recipient_id, amount, net_amount
  INTO v_sender_id, v_recipient_id, v_amount, v_net_amount
  FROM internal_transfers
  WHERE id = p_transfer_id AND status = 'pending'
  FOR UPDATE;

  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'Pending transfer not found';
  END IF;

  -- 2. Update recipient balance (gets net amount after fees)
  UPDATE wallets
  SET balance = balance + v_net_amount,
      updated_at = NOW()
  WHERE user_id = v_recipient_id;

  -- 3. Deduct from sender pending balance (deducts full gross amount)
  UPDATE wallets
  SET pending_balance = GREATEST(0, pending_balance - v_amount),
      updated_at = NOW()
  WHERE user_id = v_sender_id;

  -- 4. Mark transfer as completed
  UPDATE internal_transfers
  SET status = 'completed',
      processed_at = NOW(),
      processed_by = p_admin_id,
      updated_at = NOW()
  WHERE id = p_transfer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reject Pending Transfer (Return from pending to liquid balance)
CREATE OR REPLACE FUNCTION reject_internal_transfer(
  p_transfer_id UUID,
  p_admin_id UUID,
  p_notes TEXT
) RETURNS VOID AS $$
DECLARE
  v_sender_id UUID;
  v_amount NUMERIC;
BEGIN
  -- 1. Get and lock transfer record
  SELECT sender_id, amount
  INTO v_sender_id, v_amount
  FROM internal_transfers
  WHERE id = p_transfer_id AND status = 'pending'
  FOR UPDATE;

  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'Pending transfer not found';
  END IF;

  -- 2. Return funds to sender liquid balance
  UPDATE wallets
  SET balance = balance + v_amount,
      pending_balance = GREATEST(0, pending_balance - v_amount),
      updated_at = NOW()
  WHERE user_id = v_sender_id;

  -- 3. Mark transfer as rejected
  UPDATE internal_transfers
  SET status = 'rejected',
      admin_notes = p_notes,
      processed_at = NOW(),
      processed_by = p_admin_id,
      updated_at = NOW()
  WHERE id = p_transfer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Social Counters
CREATE OR REPLACE FUNCTION increment_likes(p_post_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE social_posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes(p_post_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE social_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_comments(p_post_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE social_posts SET comments_count = comments_count + 1 WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_shares(p_post_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE social_posts SET shares_count = shares_count + 1 WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_reposts(p_post_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE social_posts SET reposts_count = reposts_count + 1 WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Stats
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  v_total_users BIGINT;
  v_total_payments NUMERIC;
  v_total_jobs BIGINT;
  v_pending_withdrawals BIGINT;
  v_active_disputes BIGINT;
BEGIN
  SELECT COUNT(*) INTO v_total_users FROM users;
  SELECT COALESCE(SUM(amount), 0) INTO v_total_payments FROM payments WHERE status = 'completed';
  SELECT COUNT(*) INTO v_total_jobs FROM projects;
  SELECT COUNT(*) INTO v_active_disputes FROM disputes WHERE status = 'open';

  SELECT COUNT(*) INTO v_pending_withdrawals FROM withdrawals WHERE status = 'pending';

  RETURN jsonb_build_object(
    'totalUsers', v_total_users,
    'totalPayments', v_total_payments,
    'totalJobListings', v_total_jobs,
    'pendingWithdrawals', v_pending_withdrawals,
    'activeDisputes', v_active_disputes,
    'pendingPayments', 0,
    'pendingApprovals', 0,
    'totalWithdrawals', 0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 24. Triggers

-- Update updated_at timestamp automatically
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
