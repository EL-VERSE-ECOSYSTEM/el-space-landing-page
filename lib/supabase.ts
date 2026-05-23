import { createClient } from '@supabase/supabase-js';

// Define core interfaces to improve type safety
export interface User {
  id: string;
  email: string;
  full_name: string;
  name?: string; // Legacy alias
  user_type: 'client' | 'freelancer';
  role: string;
  el_space_id: string;
  avatar_url?: string;
  profile_picture?: string;
  verified_badge?: number;
  password_hash?: string;
  created_at: string;
  updated_at: string;
  user_metadata?: any;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  total_budget?: number;
  category: string;
  status: string;
  visibility: string;
  created_at: string;
  updated_at: string;
  client?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
}

export interface Application {
  id: string;
  project_id: string;
  freelancer_id: string;
  status: string;
  proposed_rate?: number;
  estimated_days?: number;
  created_at: string;
  updated_at: string;
  project?: Project;
  milestones?: any[];
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  escrow_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
}

// Check if we're in a build environment
const isBuildTime = () => {
  return typeof process !== 'undefined' && 
         typeof process.env !== 'undefined' &&
         process.env.NEXT_PHASE === 'phase-production-build';
};

const createMockClient = () => {
  const mockResponse = { data: null, error: null, count: 0 };
  const builder: any = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    lt: () => builder,
    gte: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    in: () => builder,
    contains: () => builder,
    containedBy: () => builder,
    rangeGt: () => builder,
    rangeGte: () => builder,
    rangeLt: () => builder,
    rangeLte: () => builder,
    rangeAdjacent: () => builder,
    overlaps: () => builder,
    match: () => builder,
    not: () => builder,
    or: () => builder,
    filter: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    abortSignal: () => builder,
    single: () => Promise.resolve(mockResponse),
    maybeSingle: () => Promise.resolve(mockResponse),
    then: (onfulfilled: any) => Promise.resolve(mockResponse).then(onfulfilled),
  };

  return {
    from: () => builder,
    rpc: () => Promise.resolve(mockResponse),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
      })
    }
  };
};

let supabaseInstance: any = null;

const getSupabaseClient = () => {
  if (isBuildTime()) return createMockClient();
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return createMockClient();
  }
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop);
    if (typeof value === 'function') return value.bind(client);
    return value;
  }
});

// ============ USERS ============

export const createUser = async (email: string, name: string, userType: 'client' | 'entrepreneur' | 'business' | 'enterprise' | 'freelancer') => {
  const el_space_id = `EL-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, full_name: name, user_type: userType, verified_badge: 0, role: 'user', el_space_id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
    .select();
  return { data: (data?.[0] as User) || null, error };
};

export const getUser = async (email: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
  return { data: (data as User) || null, error };
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
  return { data: (data as User) || null, error };
};

export const getUserBySpaceId = async (spaceId: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('el_space_id', spaceId).maybeSingle();
  return { data: (data as User) || null, error };
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase.from('users').delete().eq('id', userId);
  return { error };
};

// ============ PROJECTS & FEED ============

export const createProject = async (projectData: any) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      ...projectData,
      status: 'open',
      visibility: projectData.visibility || 'public'
    }])
    .select();
  return { data: (data?.[0] as Project) || null, error };
};

export const getProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();
  return { data: (data as Project) || null, error };
};

export const getProjectsByClient = async (clientId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  return { data: (data as Project[]) || [], error };
};

export const getOpenProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  return { data: (data as Project[]) || [], error };
};

export const getProjectFeed = async (limit = 20) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:users!client_id(full_name, avatar_url)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data: (data as any[]) || [], error };
};

export const updateProjectStatus = async (projectId: string, status: string) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select();
  return { data: (data?.[0] as Project) || null, error };
};

export const createClientProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('client_profiles')
    .insert([{ ...profileData, user_id: userId }])
    .select();
  return { data: data?.[0] || null, error };
};

export const getClientProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return { data, error };
};

export const updateClientProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('client_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select();
  return { data: data?.[0] || null, error };
};

// ============ FREELANCER PROFILES ============

export const createFreelancerProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .insert([{ ...profileData, user_id: userId }])
    .select();
  return { data: data?.[0] || null, error };
};

export const getFreelancerProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return { data: data || null, error };
};

export const getFreelancers = async (limit = 10) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select(`
      *,
      user:users!user_id(full_name, email, avatar_url)
    `)
    .order('avg_rating', { ascending: false })
    .limit(limit);
  return { data: (data as any[]) || [], error };
};

export const getFreelancersBySkills = async (skills: string[], limit = 10) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .contains('skills', skills)
    .limit(limit)
    .order('avg_rating', { ascending: false });
  return { data: (data as any[]) || [], error };
};

export const updateFreelancerProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .update({ ...updates, updated_at: new Date() })
    .eq('user_id', userId)
    .select();
  return { data: data?.[0] || null, error };
};

// ============ MILESTONES ============

export const createMilestone = async (milestoneData: any) => {
  const { data, error } = await supabase
    .from('milestones')
    .insert([{ ...milestoneData, status: 'pending' }])
    .select();
  return { data: data?.[0] || null, error };
};

export const getMilestonesByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('due_date', { ascending: true });
  return { data: (data as any[]) || [], error };
};

export const updateMilestoneStatus = async (milestoneId: string, status: string) => {
  const { data, error } = await supabase
    .from('milestones')
    .update({ 
      status, 
      updated_at: new Date().toISOString(),
      ...(status === 'released' && { released_at: new Date().toISOString() })
    })
    .eq('id', milestoneId)
    .select();
  return { data: data?.[0] || null, error };
};

// ============ WALLETS & TRANSFERS ============

export const getWallet = async (userId: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (!error && !data) {
    // Wallet doesn't exist, create one
    return createWallet(userId);
  }
  return { data: (data as Wallet) || null, error };
};

export const createWallet = async (userId: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .insert([{ user_id: userId, balance: 0, currency: 'USD' }])
    .select();
  return { data: (data?.[0] as Wallet) || null, error };
};

export const updateWalletBalance = async (userId: string, balance: number, pending_balance: number = 0, total_earned?: number) => {
  const updateData: any = { balance, pending_balance };
  if (total_earned !== undefined) updateData.total_earned = total_earned;

  const { data, error } = await supabase
    .from('wallets')
    .update(updateData)
    .eq('user_id', userId)
    .select();
  return { data: data?.[0], error };
};

export const internalTransfer = async (fromUserId: string, toSpaceId: string, amount: number) => {
  // 1. Get recipient
  const { data: recipient, error: recError } = await getUserBySpaceId(toSpaceId);
  if (recError || !recipient) throw new Error('Recipient not found');

  // 2. Perform atomic transfer via RPC
  const { data, error } = await supabase.rpc('process_internal_transfer', {
    p_sender_id: fromUserId,
    p_recipient_id: recipient.id,
    p_amount: amount
  });
  
  return { data, error, recipient };
};

// ============ PAYMENTS ============

export const createPayment = async (paymentData: any) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([{ 
      ...paymentData, 
      status: 'pending',
      created_at: new Date()
    }])
    .select();
  return { data: data?.[0] || null, error };
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
  return (data as any[]) || [];
};

export const updatePaymentStatus = async (paymentId: string, status: string) => {
  const { data, error } = await supabase
    .from('payments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', paymentId)
    .select();
  return { data: data?.[0] || null, error };
};

// ============ REVIEWS ============

export const createReview = async (reviewData: any) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ ...reviewData, both_submitted: false }])
    .select();
  return { data: data?.[0] || null, error };
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
  const avgRating = (data as any[]).reduce((sum, r) => sum + r.rating, 0) / data.length;
  return parseFloat(avgRating.toFixed(1));
};

// ============ APPLICATIONS ============

export const createApplication = async (applicationData: any) => {
  const { data, error } = await supabase
    .from('applications')
    .insert([{ ...applicationData, status: 'pending' }])
    .select();
  return { data: (data?.[0] as Application) || null, error };
};

export const getApplicationsByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  return { data: (data as Application[]) || [], error };
};

export const getApplicationsByFreelancer = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('freelancer_id', freelancerId);
  return { data: (data as Application[]) || [], error };
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
  const { data, error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .select();
  return { data: (data?.[0] as Application) || null, error };
};

// ============ EARNINGS ============

export const getFreelancerEarnings = async (freelancerId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('freelancer_id', freelancerId)
    .eq('status', 'completed');
  
  if (error || !data) return { total: 0, earnings: [] };
  const total = (data as any[]).reduce((sum, p) => sum + (p.amount - p.fee_amount), 0);
  return { total, earnings: data };
};

// ============ TIME LOGS ============

export const createTimeLog = async (timeLogData: any) => {
  const { data, error } = await supabase
    .from('time_logs')
    .insert([timeLogData])
    .select();
  return { data: data?.[0] || null, error };
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
  return { data: data?.[0] || null, error };
};

export const getSavedFreelancers = async (clientId: string) => {
  const { data, error } = await supabase
    .from('saved_freelancers')
    .select('*')
    .eq('client_id', clientId);
  return { data, error };
};

// ============ DISPUTES & RESOLUTION ============

export const createDispute = async (disputeData: any) => {
  const { data, error } = await supabase
    .from('disputes')
    .insert([{ 
      ...disputeData, 
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select();
  return { data: data?.[0] || null, error };
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
    .or(`initiated_by.eq.${userId},initiated_against.eq.${userId}`)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getDispute = async (disputeId: string) => {
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .eq('id', disputeId)
    .maybeSingle();
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
  return { data: data?.[0] || null, error };
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
  return { data: data?.[0] || null, error };
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
  return { data: data?.[0] || null, error };
};

export const getMediationSession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('mediation_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();
  return { data, error };
};

export const updateMediationSession = async (sessionId: string, updates: any) => {
  const { data, error } = await supabase
    .from('mediation_sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select();
  return { data: data?.[0] || null, error };
};

export const recordMediationOutcome = async (disputeId: string, outcome: any) => {
  const { data, error } = await supabase
    .from('mediation_outcomes')
    .insert([{
      dispute_id: disputeId,
      ...outcome,
      created_at: new Date().toISOString()
    }])
    .select();
  return { data: data?.[0] || null, error };
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
  return { data: data?.[0] || null, error };
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
  return { data: data?.[0] || null, error };
};

// ============ ADMIN HELPERS ============

export const getAllUsers = async () => {
  const { data } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as User[]) || [];
};

export const getAllPayments = async () => {
  const { data } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as any[]) || [];
};

export const getAllJobs = async () => {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as Project[]) || [];
};

// ============ SOCIAL POSTS ============

export const createPost = async (postData: { user_id: string; content: string; media_urls?: string[]; media_type?: 'image' | 'video' | 'none' }) => {
  const { data, error } = await supabase
    .from('social_posts')
    .insert([postData])
    .select();
  return { data: data?.[0] || null, error };
};

export const getPosts = async (limit = 20) => {
  const { data, error } = await supabase
    .from('social_posts')
    .select(`
      *,
      user:users!user_id(full_name, avatar_url, el_space_id)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data: (data as any[]) || [], error };
};

export const likePost = async (postId: string, userId: string) => {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('social_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingLike) {
    // Unlike
    await supabase.from('social_likes').delete().eq('post_id', postId).eq('user_id', userId);
    await supabase.rpc('decrement_likes', { p_post_id: postId });
    return { liked: false };
  } else {
    // Like
    await supabase.from('social_likes').insert([{ post_id: postId, user_id: userId }]);
    await supabase.rpc('increment_likes', { p_post_id: postId });
    return { liked: true };
  }
};

export const addComment = async (postId: string, userId: string, content: string) => {
  const { data, error } = await supabase
    .from('social_comments')
    .insert([{ post_id: postId, user_id: userId, content }])
    .select();

  if (!error) {
    await supabase.rpc('increment_comments', { p_post_id: postId });
  }

  return { data: data?.[0] || null, error };
};

// ============ PORTFOLIO ============

export const getPortfolio = async (userId: string) => {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: (data as any[]) || [], error };
};

export const createPortfolioItem = async (userId: string, itemData: any) => {
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert([{ ...itemData, user_id: userId }])
    .select();
  return { data: data?.[0] || null, error };
};

// ============ STORAGE ASSETS ============

export const trackStorageAsset = async (assetData: {
  user_id: string;
  file_path: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  bucket_name: string;
}) => {
  const { data, error } = await supabase
    .from('storage_assets')
    .insert([assetData])
    .select();
  return { data: data?.[0] || null, error };
};
