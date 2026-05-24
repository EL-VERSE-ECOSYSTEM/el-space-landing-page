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

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='transaction_pin_hash') THEN
        ALTER TABLE users ADD COLUMN transaction_pin_hash TEXT;
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

    -- Payments table updates
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='recipient_id') THEN
        ALTER TABLE payments ADD COLUMN recipient_id UUID REFERENCES users(id);
    END IF;

    -- Messages table updates
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='recipient_id') THEN
        ALTER TABLE messages ADD COLUMN recipient_id UUID REFERENCES users(id);
    END IF;

    -- Ensure chat_rooms exists before adding room_id to messages
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='chat_rooms') THEN
        CREATE TABLE chat_rooms (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            project_id UUID,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='room_id') THEN
        ALTER TABLE messages ADD COLUMN room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE;
    END IF;

    -- Ensure withdrawals table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='withdrawals') THEN
        CREATE TABLE withdrawals (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
            wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
            payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
            amount NUMERIC NOT NULL,
            currency TEXT DEFAULT 'USD',
            fee_amount NUMERIC DEFAULT 0,
            net_amount NUMERIC NOT NULL,
            method TEXT NOT NULL,
            account_details JSONB NOT NULL,
            status TEXT CHECK (status IN ('pending', 'approved', 'completed', 'rejected')) DEFAULT 'pending',
            admin_notes TEXT,
            processed_at TIMESTAMPTZ,
            processed_by UUID REFERENCES users(id),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    -- Ensure internal_transfers table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='internal_transfers') THEN
        CREATE TABLE internal_transfers (
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
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='internal_transfers' AND column_name='fee_amount') THEN
        ALTER TABLE internal_transfers ADD COLUMN fee_amount NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='internal_transfers' AND column_name='net_amount') THEN
        ALTER TABLE internal_transfers ADD COLUMN net_amount NUMERIC DEFAULT 0;
    END IF;

    -- Ensure deposits table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='deposits') THEN
        CREATE TABLE deposits (
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
