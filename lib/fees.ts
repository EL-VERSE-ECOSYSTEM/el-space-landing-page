export type ProjectSize = 'micro' | 'standard' | 'premium';

export function getProjectSize(amount: number): ProjectSize {
  if (amount < 500) return 'micro';
  if (amount <= 5000) return 'standard';
  return 'premium';
}

export function calculateClientFee(amount: number): number {
  if (amount < 500) return 19;
  if (amount <= 5000) return amount * 0.05;
  return amount * 0.03;
}

export function calculateFreelancerFee(amount: number): number {
  if (amount < 500) return 9;
  if (amount <= 5000) return amount * 0.05;
  return amount * 0.03;
}

export function calculateInstantPayFee(amount: number): number {
  return amount * 0.05;
}

export const LATE_SUBMISSION_PENALTY = 25;

export function calculateFreelancerPayout(amount: number, isLate: boolean = false, isInstant: boolean = false): number {
  const baseFee = calculateFreelancerFee(amount);
  let payout = amount - baseFee;
  
  if (isLate) {
    payout -= LATE_SUBMISSION_PENALTY;
  }
  
  if (isInstant) {
    payout -= calculateInstantPayFee(payout);
  }
  
  return Math.max(0, payout);
}
