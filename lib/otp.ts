import { supabase } from './supabase';

export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export async function storeOTP(email: string, code: string, expires_in: number = 900, type: string = 'login') {
  const expires_at = new Date(Date.now() + expires_in * 1000).toISOString();

  // First delete any existing OTP for this email and type
  await supabase.from('otp_codes').delete().eq('email', email).eq('type', type);

  const { data, error } = await supabase
    .from('otp_codes')
    .insert([{
      email,
      code,
      expires_at,
      type
    }])
    .select();

  return { data, error };
}

export async function verifyOTP(email: string, code: string, type: string = 'login') {
  const { data, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .eq('code', code)
    .eq('type', type)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data) return { success: false, error: 'Invalid or expired OTP' };

  // Delete after use
  await supabase.from('otp_codes').delete().eq('id', data.id);

  return { success: true };
}
