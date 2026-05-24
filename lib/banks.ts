// Banks by country for withdrawal
export type CountryCode = 'NG' | 'GH' | 'KE' | 'US' | 'GB' | 'CA' | 'IN' | 'ZA' | 'TZ' | 'ET' | 'UG';

export interface Bank {
  code: string;
  name: string;
  currency: string;
}

export const BANKS_BY_COUNTRY: Record<CountryCode, Bank[]> = {
  NG: [
    // Tier 1 Banks
    { code: '044', name: 'Access Bank Nigeria', currency: 'NGN' },
    { code: '050', name: 'Guaranty Trust Bank (GTBank)', currency: 'NGN' },
    { code: '011', name: 'First City Monument Bank (FCMB)', currency: 'NGN' },
    { code: '012', name: 'Union Bank of Nigeria', currency: 'NGN' },
    { code: '214', name: 'Zenith Bank', currency: 'NGN' },
    { code: '058', name: 'Guaranty Trust Bank Mobile', currency: 'NGN' },
    { code: '070', name: 'Fidelity Bank Nigeria', currency: 'NGN' },
    { code: '063', name: 'United Bank For Africa (UBA)', currency: 'NGN' },
    { code: '304', name: 'Stanbic IBTC Bank', currency: 'NGN' },
    { code: '084', name: 'Ecobank Nigeria', currency: 'NGN' },
    
    // Other Commercial Banks
    { code: '023', name: 'Bank of Industry', currency: 'NGN' },
    { code: '035', name: 'Wema Bank', currency: 'NGN' },
    { code: '068', name: 'Standard Chartered Bank Nigeria', currency: 'NGN' },
    { code: '076', name: 'Skye Bank (Polaris)', currency: 'NGN' },
    { code: '065', name: 'Keystone Bank Nigeria', currency: 'NGN' },
    { code: '999', name: 'Fidelity Bank', currency: 'NGN' },
    
    // Microfinance and Fintech Banks
    { code: '50515', name: 'Moniepoint MFB', currency: 'NGN' },
    { code: '999992', name: 'OPay Digital Services Limited (OPay)', currency: 'NGN' },
    { code: '999991', name: 'PalmPay', currency: 'NGN' },
    { code: '50211', name: 'Kuda Microfinance Bank', currency: 'NGN' },
    { code: '565', name: 'Carbon', currency: 'NGN' },
    { code: '50629', name: 'Sparkle Microfinance Bank', currency: 'NGN' },
    { code: '50515', name: 'FairMoney Microfinance Bank', currency: 'NGN' },
    { code: '090110', name: 'VFD Microfinance Bank (VBank)', currency: 'NGN' },
    { code: '100004', name: 'Opay', currency: 'NGN' },
    { code: '100033', name: 'Palmpay', currency: 'NGN' },
    { code: '50211', name: 'Kuda', currency: 'NGN' },
    { code: '50629', name: 'Sparkle', currency: 'NGN' },
    { code: '565', name: 'Carbon', currency: 'NGN' },
    { code: '526', name: 'Moniepoint', currency: 'NGN' },
    { code: '000017', name: 'Wema Bank (ALAT)', currency: 'NGN' },
    { code: '090267', name: 'Kuda Bank', currency: 'NGN' },
    { code: '090110', name: 'VFD MFB', currency: 'NGN' },
    { code: '090175', name: 'HighStreet MFB', currency: 'NGN' },
    { code: '090405', name: 'Moniepoint MFB', currency: 'NGN' },
    { code: '090452', name: 'SmartCash PSB', currency: 'NGN' },
    { code: '090453', name: 'MoMo PSB', currency: 'NGN' },
    { code: '090454', name: '9PSB', currency: 'NGN' },
    { code: '090455', name: 'MTN MoMo', currency: 'NGN' },
    { code: '090456', name: 'Airtel SmartCash', currency: 'NGN' },
    { code: '120001', name: '9mobile 9PSB', currency: 'NGN' },
    
    // Additional Banks
    { code: '403', name: 'JAIZ Bank', currency: 'NGN' },
    { code: '102', name: 'Vanguard Bank', currency: 'NGN' },
    { code: '058', name: 'Gtco (GTBank)', currency: 'NGN' },
    { code: '039', name: 'Infinity Bank', currency: 'NGN' },
    { code: '809', name: 'Village Financial Services', currency: 'NGN' },
    { code: '038', name: 'Heritage Bank', currency: 'NGN' },
    { code: '037', name: 'Zenith Bank Alt Code', currency: 'NGN' },
    { code: '100004', name: 'Opay (Digital)', currency: 'NGN' },
    { code: '100033', name: 'Palmpay (Digital)', currency: 'NGN' },
    { code: '50211', name: 'Kuda (Fintech)', currency: 'NGN' },
  ],
  GH: [
    { code: '010050', name: 'Ecobank Ghana', currency: 'GHS' },
    { code: '010100', name: 'Zenith Bank Ghana', currency: 'GHS' },
    { code: '010500', name: 'Absa Bank Ghana', currency: 'GHS' },
    { code: '010200', name: 'Standard Chartered Bank Ghana', currency: 'GHS' },
    { code: '010400', name: 'Barclays Bank Ghana', currency: 'GHS' },
    { code: '010600', name: 'FirstBank Ghana', currency: 'GHS' },
    { code: '010700', name: 'UBA Ghana', currency: 'GHS' },
    { code: '010900', name: 'MTN Ghana', currency: 'GHS' },
  ],
  KE: [
    { code: '001', name: 'KCB Bank Kenya', currency: 'KES' },
    { code: '002', name: 'Equity Bank Kenya', currency: 'KES' },
    { code: '003', name: 'Safaricom', currency: 'KES' },
    { code: '004', name: 'Airtel Kenya', currency: 'KES' },
    { code: '005', name: 'Standard Chartered Bank Kenya', currency: 'KES' },
    { code: '006', name: 'NCBA Bank Kenya', currency: 'KES' },
    { code: '007', name: 'ABSA Bank Kenya', currency: 'KES' },
    { code: '008', name: 'Co-operative Bank', currency: 'KES' },
    { code: '009', name: 'Barclays Bank Kenya', currency: 'KES' },
    { code: '010', name: 'Diamond Trust Bank', currency: 'KES' },
  ],
  US: [
    { code: 'CHAS', name: 'Chase Bank (JPMorgan)', currency: 'USD' },
    { code: 'BOFA', name: 'Bank of America', currency: 'USD' },
    { code: 'WFGO', name: 'Wells Fargo', currency: 'USD' },
    { code: 'CITI', name: 'Citibank', currency: 'USD' },
    { code: 'GS', name: 'Goldman Sachs', currency: 'USD' },
    { code: 'MS', name: 'Morgan Stanley', currency: 'USD' },
    { code: 'USB', name: 'U.S. Bank', currency: 'USD' },
    { code: 'TDB', name: 'TD Bank', currency: 'USD' },
    { code: 'PNC', name: 'PNC Bank', currency: 'USD' },
    { code: 'COF', name: 'Capital One', currency: 'USD' },
  ],
  GB: [
    { code: 'BARC', name: 'Barclays Bank', currency: 'GBP' },
    { code: 'HBKAGB22', name: 'HSBC Bank UK', currency: 'GBP' },
    { code: 'LLOYSGB21', name: 'Lloyds Banking Group', currency: 'GBP' },
    { code: 'NWABGB22', name: 'NatWest Group', currency: 'GBP' },
    { code: 'MIDLGB22', name: 'Midland Bank', currency: 'GBP' },
    { code: 'GEBAGB2L', name: 'Nationwide Building Society', currency: 'GBP' },
    { code: 'BKCHUS33', name: 'Standard Chartered Bank', currency: 'GBP' },
  ],
  CA: [
    { code: '002', name: 'Royal Bank of Canada', currency: 'CAD' },
    { code: '010', name: 'Toronto Dominion Bank', currency: 'CAD' },
    { code: '016', name: 'Bank of Montreal', currency: 'CAD' },
    { code: '039', name: 'Bank of Nova Scotia', currency: 'CAD' },
    { code: '003', name: 'Bank of commerce', currency: 'CAD' },
    { code: '004', name: 'National Bank of Canada', currency: 'CAD' },
  ],
  IN: [
    { code: 'SBIN0000001', name: 'State Bank of India', currency: 'INR' },
    { code: 'HDFC0000053', name: 'HDFC Bank', currency: 'INR' },
    { code: 'ICIC0000001', name: 'ICICI Bank', currency: 'INR' },
    { code: 'AXIS0000001', name: 'Axis Bank', currency: 'INR' },
    { code: 'UTIB0000123', name: 'Axis Bank', currency: 'INR' },
    { code: 'IDIB000J001', name: 'IDBI Bank', currency: 'INR' },
  ],
  ZA: [
    { code: '250655', name: 'ABSA Bank South Africa', currency: 'ZAR' },
    { code: '260054', name: 'FirstRand Bank', currency: 'ZAR' },
    { code: '470010', name: 'Nedbank', currency: 'ZAR' },
    { code: '580105', name: 'Standard Bank', currency: 'ZAR' },
    { code: '632005', name: 'Bank of China', currency: 'ZAR' },
  ],
  TZ: [
    { code: '000001', name: 'National Bank of Tanzania', currency: 'TZS' },
    { code: '000002', name: 'Tanzania Post Bank', currency: 'TZS' },
    { code: '000003', name: 'CRDB Bank', currency: 'TZS' },
    { code: '000004', name: 'Azania Bank', currency: 'TZS' },
    { code: '000005', name: 'Bank of Asia Tanzania', currency: 'TZS' },
  ],
  ET: [
    { code: '01', name: 'National Bank of Ethiopia', currency: 'ETB' },
    { code: '02', name: 'Commercial Bank of Ethiopia', currency: 'ETB' },
    { code: '03', name: 'Addis International Bank', currency: 'ETB' },
    { code: '04', name: 'Abyssinia Bank', currency: 'ETB' },
  ],
  UG: [
    { code: '001', name: 'Bank of Uganda', currency: 'UGX' },
    { code: '002', name: 'CRDB Bank Uganda', currency: 'UGX' },
    { code: '003', name: 'Standard Chartered Bank', currency: 'UGX' },
    { code: '004', name: 'Barclays Bank Uganda', currency: 'UGX' },
    { code: '005', name: 'Centenary Bank', currency: 'UGX' },
  ],
};

export const COUNTRY_CURRENCIES: Record<CountryCode, string> = {
  NG: 'NGN',
  GH: 'GHS',
  KE: 'KES',
  US: 'USD',
  GB: 'GBP',
  CA: 'CAD',
  IN: 'INR',
  ZA: 'ZAR',
  TZ: 'TZS',
  ET: 'ETB',
  UG: 'UGX',
};

export const CRYPTO_NETWORKS = [
  { code: 'TRC20', name: 'USDT (TRC20)', asset: 'USDT' },
  { code: 'ERC20', name: 'USDT (ERC20)', asset: 'USDT' },
  { code: 'SOL', name: 'USDT (Solana)', asset: 'USDT' },
  { code: 'BEP20', name: 'USDT (BSC)', asset: 'USDT' },
  { code: 'SOL_NATIVE', name: 'Solana (Native)', asset: 'SOL' },
  { code: 'ETH_NATIVE', name: 'Ethereum (Native)', asset: 'ETH' },
];

export const SUPPORTED_COUNTRIES = [
  { name: 'Nigeria', code: 'NG' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Kenya', code: 'KE' },
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Canada', code: 'CA' },
  { name: 'India', code: 'IN' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Uganda', code: 'UG' },
];
