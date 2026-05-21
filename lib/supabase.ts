import { createClient } from '@supabase/supabase-js';

// Check if we're in a build environment where env vars might not be fully available
const isBuildTime = () => {
  return typeof process !== 'undefined' && 
         typeof process.env !== 'undefined' &&
         process.env.NEXT_PHASE === 'phase-production-build';
};

// Create a mock Supabase client for build time
const createMockClient = () => {
  const mockResponse = Promise.resolve({ data: null, error: null });
  
  const queryBuilder = {
    select: () => mockResponse,
    insert: () => mockResponse,
    update: () => mockResponse,
    delete: () => mockResponse,
    eq: function() { return this; },
    single: () => mockResponse,
    order: function() { return this; },
    limit: function() { return this; },
    contains: function() { return this; },
  };

  return {
    from: () => queryBuilder,
    rpc: () => mockResponse,
  };
};

// Initialize Supabase client lazily to avoid build-time errors
let supabaseInstance: ReturnType<typeof createClient> | null = null;
let isMockClient = false;

const getSupabaseClient = () => {
  // Return mock client during build time
  if (isBuildTime()) {
    return createMockClient();
  }

  // Return cached instance if available
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if we have valid environment variables
  if (!supabaseUrl || !supabaseAnonKey ||
      supabaseUrl.includes('placeholder') ||
      supabaseAnonKey.includes('placeholder')) {
    console.warn('Warning: Supabase environment variables are not properly configured. Using mock client.');
    isMockClient = true;
    supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
  } else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
};

// Export a proxy that intercepts all method calls
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop);
    
    // If it's a function, bind it to the client
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    return value;
  }
});

// ============ USERS ============

export const createUser = async (email: string, name: string, userType: 'client' | 'freelancer') => {
  let el_space_id = `EL-${Math.floor(10000000 + Math.random() * 90000000)}`;
  
  // Try to ensure uniqueness (simple check, though in production you'd use a DB constraint)
  const { data: existing } = await getUserBySpaceId(el_space_id);
  if (existing) {
    el_space_id = `EL-${Math.floor(10000000 + Math.random() * 90000000)}`;
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{ 
      email, 
      full_name: name,
      user_type: userType, 
      verified_badge: 0, 
      role: 'user',
      el_space_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as any])
    .select();
  return { data: data?.[0], error };
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  return { error };
};

export const getUser = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  return { data, error };
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const getUserBySpaceId = async (spaceId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('el_space_id', spaceId)
    .single();
  return { data, error };
};

// ============ PROJECTS & FEED ============

export const createProject = async (projectData: unknown) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ ...projectData, status: 'open' }])
    .select();
  return { data: data?.[0], error };
};

export const getProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  return { data, error };
};

export const getProjectsByClient = async (clientId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getOpenProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getProjectFeed = async (limit = 20) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:users!client_id(name, avatar_url)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

export const updateProjectStatus = async (projectId: string, status: string) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ status, updated_at: new Date() })
    .eq('id', projectId)
    .select();
  return { data: data?.[0], error };
};

export const createClientProfile = async (userId: string, profileData: unknown) => {
  const { data, error } = await supabase
    .from('client_profiles')
    .insert([{ ...profileData, user_id: userId }])
    .select();
  return { data: data?.[0], error };
};

export const getClientProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const updateClientProfile = async (userId: string, updates: unknown) => {
  const { data, error } = await supabase
    .from('client_profiles')
    .update({ ...updates, updated_at: new Date() })
    .eq('user_id', userId)
    .select();
  return { data: data?.[0], error };
};

// ============ FREELANCER PROFILES ============

export const createFreelancerProfile = async (userId: string, profileData: unknown) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .insert([{ ...profileData, user_id: userId }])
    .select();
  return { data: data?.[0], error };
};

export const getFreelancerProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const getFreelancers = async (limit = 10) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select(`
      *,
      user:users!user_id(name, email, avatar_url)
    `)
    .order('avg_rating', { ascending: false })
    .limit(limit);
  return { data, error };
};

export const getFreelancersBySkills = async (skills: string[], limit = 10) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .contains('skills', skills)
    .limit(limit)
    .order('avg_rating', { ascending: false });
  return { data, error };
};

export const updateFreelancerProfile = async (userId: string, updates: unknown) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .update({ ...updates, updated_at: new Date() })
    .eq('user_id', userId)
    .select();
  return { data: data?.[0], error };
};

// ============ MILESTONES ============

export const createMilestone = async (milestoneData: unknown) => {
  const { data, error } = await supabase
    .from('milestones')
    .insert([{ ...milestoneData, status: 'pending' }])
    .select();
  return { data: data?.[0], error };
};

export const getMilestonesByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('due_date', { ascending: true });
  return { data, error };
};

export const updateMilestoneStatus = async (milestoneId: string, status: string) => {
  const { data, error } = await supabase
    .from('milestones')
    .update({ 
      status, 
      updated_at: new Date(),
      ...(status === 'released' && { released_at: new Date() })
    })
    .eq('id', milestoneId)
    .select();
  return { data: data?.[0], error };
};

// ============ WALLETS & TRANSFERS ============

export const getWallet = async (userId: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code === 'PGRST116') {
    // Wallet doesn't exist, create one
    return createWallet(userId);
  }
  return { data, error };
};

export const createWallet = async (userId: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .insert([{ user_id: userId, balance: 0, currency: 'USD' }])
    .select();
  return { data: data?.[0], error };
};

export const updateWalletBalance = async (userId: string, amount: number) => {
  // Use a RPC call for atomic increment to avoid race conditions
  const { data, error } = await supabase.rpc('increment_wallet_balance', {
    user_id_param: userId,
    amount_param: amount
  });
  return { data, error };
};

export const internalTransfer = async (fromUserId: string, toSpaceId: string, amount: number) => {
  // 1. Get recipient
  const { data: recipient, error: recError } = await getUserBySpaceId(toSpaceId);
  if (recError || !recipient) throw new Error('Recipient not found');

  // 2. Perform atomic transfer via RPC
  const { data, error } = await supabase.rpc('process_internal_transfer', {
    sender_id: fromUserId,
    recipient_id: recipient.id,
    transfer_amount: amount
  });
  
  return { data, error, recipient };
};

// ============ PAYMENTS ============

export const createPayment = async (paymentData: unknown) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([{ 
      ...paymentData, 
      status: 'pending',
      created_at: new Date()
    }])
    .select();
  return { data: data?.[0], error };
};

export const getPaymentsByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('project_id', projectId);
  return { data, error };
};

export const getAllUserPayments = async (userId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  return data || [];
};

export const updatePaymentStatus = async (paymentId: string, status: string) => {
  const { data, error } = await supabase
    .from('payments')
    .update({ status, updated_at: new Date() })
    .eq('id', paymentId)
    .select();
  return { data: data?.[0], error };
};

// ============ REVIEWS ============

export const createReview = async (reviewData: unknown) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ ...reviewData, both_submitted: false }])
    .select();
  return { data: data?.[0], error };
};

export const getReviewsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('reviewee_id', userId)
    .eq('visibility', 'public');
  return { data, error };
};

export const getUserAverageRating = async (userId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', userId)
    .eq('visibility', 'public');
  
  if (error || !data || data.length === 0) return 0;
  const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  return parseFloat(avgRating.toFixed(1));
};

// ============ APPLICATIONS ============

export const createApplication = async (applicationData: unknown) => {
  const { data, error } = await supabase
    .from('applications')
    .insert([{ ...applicationData, status: 'pending' }])
    .select();
  return { data: data?.[0], error };
};

export const getApplicationsByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getApplicationsByFreelancer = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('freelancer_id', freelancerId);
  return { data, error };
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
  const { data, error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date() })
    .eq('id', applicationId)
    .select();
  return { data: data?.[0], error };
};

// ============ EARNINGS ============

export const getFreelancerEarnings = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('freelancer_id', freelancerId)
    .eq('status', 'completed');
  
  if (error || !data) return { total: 0, earnings: [] };
  const total = data.reduce((sum, p) => sum + (p.amount - p.fee_amount), 0);
  return { total, earnings: data };
};

// ============ TIME LOGS ============

export const createTimeLog = async (timeLogData: unknown) => {
  const { data, error } = await supabase
    .from('time_logs')
    .insert([timeLogData])
    .select();
  return { data: data?.[0], error };
};

export const getTimeLogs = async (projectId: string) => {
  const { data, error } = await supabase
    .from('time_logs')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// ============ SAVED FREELANCERS ============

export const saveFreelancer = async (clientId: string, freelancerId: string) => {
  const { data, error } = await supabase
    .from('saved_freelancers')
    .insert([{ client_id: clientId, freelancer_id: freelancerId }])
    .select();
  return { data: data?.[0], error };
};

export const getSavedFreelancers = async (clientId: string) => {
  const { data, error } = await supabase
    .from('saved_freelancers')
    .select('*')
    .eq('client_id', clientId);
  return { data, error };
};

// ============ DISPUTES & RESOLUTION ============

export const createDispute = async (disputeData: unknown) => {
  const { data, error } = await supabase
    .from('disputes')
    .insert([{ 
      ...disputeData, 
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select();
  return { data: data?.[0], error };
};

export const getDisputesByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getDisputesByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .or(`plaintiff_id.eq.${userId},defendant_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getDispute = async (disputeId: string) => {
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .eq('id', disputeId)
    .single();
  return { data, error };
};

export const updateDisputeStatus = async (disputeId: string, status: string, resolution?: string) => {
  const updateData: any = { 
    status,
    updated_at: new Date().toISOString()
  };
  
  if (resolution) {
    updateData.resolution = resolution;
    updateData.resolved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('disputes')
    .update(updateData)
    .eq('id', disputeId)
    .select();
  return { data: data?.[0], error };
};

export const addDisputeEvidence = async (disputeId: string, userId: string, evidence: string, attachmentUrl?: string) => {
  const { data, error } = await supabase
    .from('dispute_evidence')
    .insert([{
      dispute_id: disputeId,
      user_id: userId,
      evidence,
      attachment_url: attachmentUrl,
      created_at: new Date().toISOString()
    }])
    .select();
  return { data: data?.[0], error };
};

export const getDisputeEvidence = async (disputeId: string) => {
  const { data, error } = await supabase
    .from('dispute_evidence')
    .select('*')
    .eq('dispute_id', disputeId)
    .order('created_at', { ascending: true });
  return { data, error };
};

export const createMediationSession = async (disputeId: string, mediatorId: string) => {
  const { data, error } = await supabase
    .from('mediation_sessions')
    .insert([{
      dispute_id: disputeId,
      mediator_id: mediatorId,
      status: 'scheduled',
      created_at: new Date().toISOString()
    }])
    .select();
  return { data: data?.[0], error };
};

export const getMediationSession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('mediation_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  return { data, error };
};

export const updateMediationSession = async (sessionId: string, updates: unknown) => {
  const { data, error } = await supabase
    .from('mediation_sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select();
  return { data: data?.[0], error };
};

export const recordMediationOutcome = async (disputeId: string, outcome: unknown) => {
  const { data, error } = await supabase
    .from('mediation_outcomes')
    .insert([{
      dispute_id: disputeId,
      ...outcome,
      created_at: new Date().toISOString()
    }])
    .select();
  return { data: data?.[0], error };
};

export const getMediationOutcome = async (disputeId: string) => {
  const { data, error } = await supabase
    .from('mediation_outcomes')
    .select('*')
    .eq('dispute_id', disputeId)
    .single();
  return { data, error };
};

export const escalateDispute = async (disputeId: string, escalationReason: string) => {
  const { data, error } = await supabase
    .from('disputes')
    .update({
      status: 'escalated',
      escalation_reason: escalationReason,
      escalated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', disputeId)
    .select();
  return { data: data?.[0], error };
};

export const resolveDispute = async (
  disputeId: string,
  resolution: string,
  compensationAmount?: number,
  compensationTo?: string
) => {
  const { data, error } = await supabase
    .from('disputes')
    .update({
      status: 'resolved',
      resolution,
      compensation_amount: compensationAmount,
      compensation_to: compensationTo,
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', disputeId)
    .select();
  return { data: data?.[0], error };
};

// ============ ADMIN HELPERS ============

export const getAllUsers = async () => {
  const { data } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
};

export const getAllPayments = async () => {
  const { data } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
};

export const getAllJobs = async () => {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
};
