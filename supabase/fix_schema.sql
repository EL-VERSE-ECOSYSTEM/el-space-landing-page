-- Fix for missing columns and RLS policies

-- 1. Ensure 'visibility' column exists in 'projects' and 'reviews'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='visibility') THEN
        ALTER TABLE projects ADD COLUMN visibility TEXT CHECK (visibility IN ('public', 'private', 'invite-only')) DEFAULT 'public';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='visibility') THEN
        ALTER TABLE reviews ADD COLUMN visibility TEXT CHECK (visibility IN ('public', 'private')) DEFAULT 'public';
    END IF;
END $$;

-- 2. Ensure other critical columns exist (based on comprehensive schema)
DO $$
BEGIN
    -- Users table updates
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
        ALTER TABLE users RENAME COLUMN name TO full_name;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone_number') THEN
        ALTER TABLE users ADD COLUMN phone_number TEXT;
    END IF;

    -- Wallets table updates
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wallets' AND column_name='escrow_balance') THEN
        ALTER TABLE wallets ADD COLUMN escrow_balance NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wallets' AND column_name='pending_balance') THEN
        ALTER TABLE wallets ADD COLUMN pending_balance NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wallets' AND column_name='total_earned') THEN
        ALTER TABLE wallets ADD COLUMN total_earned NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wallets' AND column_name='total_withdrawn') THEN
        ALTER TABLE wallets ADD COLUMN total_withdrawn NUMERIC DEFAULT 0;
    END IF;

    -- Projects table updates
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='total_budget') THEN
        ALTER TABLE projects ADD COLUMN total_budget NUMERIC DEFAULT 0;
    END IF;
END $$;

-- 3. Re-apply RLS Policies that might have failed
-- (Drop them first to avoid "already exists" errors)

DROP POLICY IF EXISTS "Everyone can view open projects." ON projects;
DROP POLICY IF EXISTS "Open projects are viewable by everyone." ON projects;

CREATE POLICY "Open projects are viewable by everyone." ON projects
FOR SELECT USING (
    status = 'open' OR
    visibility = 'public' OR
    auth.uid() = client_id OR
    auth.uid() = accepted_freelancer_id
);

DROP POLICY IF EXISTS "Public reviews are viewable by everyone." ON reviews;
CREATE POLICY "Public reviews are viewable by everyone." ON reviews
FOR SELECT USING (visibility = 'public');
