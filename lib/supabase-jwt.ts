import jwt, { JwtHeader } from 'jsonwebtoken';

interface JWKSKey {
  x: string;
  y: string;
  alg: string;
  crv: string;
  ext: boolean;
  kid: string;
  kty: string;
  key_ops: string[];
}

interface JWKSResponse {
  keys: JWKSKey[];
}

const cachedKeys: Map<string, JWKSKey> = new Map();
let cacheTime: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch JWKS (JSON Web Key Set) from Supabase
 */
async function getJWKS(): Promise<JWKSResponse> {
  const discoveryUrl = process.env.SUPABASE_JWT_DISCOVERY_URL;
  
  if (!discoveryUrl) {
    throw new Error('SUPABASE_JWT_DISCOVERY_URL is not configured');
  }

  try {
    // Check if cache is still valid
    if (cachedKeys.size > 0 && Date.now() - cacheTime < CACHE_DURATION) {
      return { keys: Array.from(cachedKeys.values()) };
    }

    const response = await fetch(discoveryUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as JWKSResponse;

    // Update cache
    cachedKeys.clear();
    data.keys.forEach(key => {
      if (key.kid) {
        cachedKeys.set(key.kid, key);
      }
    });
    cacheTime = Date.now();

    return data;
  } catch (error) {
    console.error('[JWT] Error fetching JWKS:', error);
    throw new Error('Failed to fetch JWT keys from Supabase');
  }
}

/**
 * Convert JWKS EC key to PEM format
 */
function getPublicKeyFromJWK(jwk: JWKSKey): string {
  if (jwk.kty !== 'EC' || jwk.crv !== 'P-256') {
    throw new Error('Unsupported key type or curve');
  }

  // Convert base64url to base64
  const x = Buffer.from(jwk.x, 'base64');
  const y = Buffer.from(jwk.y, 'base64');

  // Build the public key in DER encoding
  const keyData = Buffer.concat([Buffer.from([0x04]), x, y]);

  // This is a simplified implementation
  // In production, you'd use a proper library like `jose` or `jsonwebtoken` with proper EC key handling
  
  // For now, we'll construct the PEM format manually
  const pem = `-----BEGIN PUBLIC KEY-----
${Buffer.concat([
  Buffer.from([0x30, 0x59, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07, 0x03, 0x42, 0x00]),
  keyData,
]).toString('base64')
  .match(/.{1,64}/g)!
  .join('\n')}
-----END PUBLIC KEY-----`;

  return pem;
}

/**
 * Verify a JWT token using Supabase JWKS
 */
export async function verifySupabaseJWT(token: string): Promise<jwt.JwtPayload> {
  try {
    // Decode header to get the key ID (kid)
    const decodedHeader = jwt.decode(token, { complete: true });
    
    if (!decodedHeader || !decodedHeader.header) {
      throw new Error('Invalid token format');
    }

    const kid = decodedHeader.header.kid;
    if (!kid) {
      throw new Error('Token missing key ID (kid)');
    }

    // Fetch JWKS
    const jwks = await getJWKS();
    const key = jwks.keys.find(k => k.kid === kid);

    if (!key) {
      throw new Error(`Unable to find key with ID: ${kid}`);
    }

    // Convert JWK to PEM
    const publicKey = getPublicKeyFromJWK(key);

    // Verify the token
    const payload = jwt.verify(token, publicKey, {
      algorithms: [(key.alg || 'ES256') as jwt.Algorithm],
    }) as jwt.JwtPayload;

    return payload;
  } catch (error) {
    console.error('[JWT] Verification failed:', error);
    throw error;
  }
}

/**
 * Middleware to verify Supabase JWT from Authorization header
 */
export function verifySupabaseJWTMiddleware(token: string): Promise<jwt.JwtPayload> {
  // Remove 'Bearer ' prefix if present
  const cleanToken = token.replace(/^Bearer\s+/i, '');
  return verifySupabaseJWT(cleanToken);
}

/**
 * Verify JWT and extract user info
 */
export async function extractUserFromJWT(token: string): Promise<{
  sub: string;
  email: string;
  email_verified?: boolean;
  user_metadata?: Record<string, any>;
}> {
  const payload = await verifySupabaseJWT(token);

  return {
    sub: payload.sub || '',
    email: payload.email || '',
    email_verified: payload.email_verified,
    user_metadata: payload.user_metadata,
  };
}

export default {
  verifySupabaseJWT,
  verifySupabaseJWTMiddleware,
  extractUserFromJWT,
};
