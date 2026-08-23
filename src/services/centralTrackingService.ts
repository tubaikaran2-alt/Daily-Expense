/**
 * Central Admin Tracking Service
 * 
 * Automatically synchronizes metadata (Logins and Reviews) to the central Google Sheet.
 * Ensures zero expense data is transmitted centrally (pure user privacy for financial transactions).
 */

export const CENTRAL_ADMIN_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbyYSjQXKb2r_j_gX545x0yEOXsK4n-i56MTldsIGvxHB2MAQi2DsZrC8o5k3DuN21Hh6g/exec';

export interface LoginMetadataPayload {
  email: string;
  name: string;
  timestamp: string;
  platform?: string;
  type?: 'Login' | 'Register' | 'Biometric';
  isPremium?: boolean;
}

export interface UserReviewPayload {
  userId: string;
  name: string;
  rating: number;
  comment: string;
  timestamp: string;
}

/**
 * Sends user login/registration metadata to Central Admin Google Sheet ("Logins" tab)
 */
export async function trackCentralLogin(payload: LoginMetadataPayload): Promise<boolean> {
  try {
    const dataToSend = {
      sheetName: 'Logins',
      timestamp: payload.timestamp || new Date().toISOString(),
      email: payload.email.toLowerCase(),
      name: payload.name,
      platform: payload.platform || (navigator.userAgent.includes('Mobile') ? 'Mobile Web' : 'Desktop Web'),
      type: payload.type || 'Login',
      isPremium: payload.isPremium ? 'VIP Pro' : 'Free'
    };

    // Async beacon / no-cors post
    await fetch(`${CENTRAL_ADMIN_WEB_APP_URL}?sheetName=Logins`, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });
    return true;
  } catch (error) {
    console.warn('Central admin login track warning (handled):', error);
    return false;
  }
}

/**
 * Sends user feedback/review to Central Admin Google Sheet ("Reviews" tab)
 */
export async function trackCentralReview(payload: UserReviewPayload): Promise<boolean> {
  try {
    const dataToSend = {
      sheetName: 'Reviews',
      timestamp: payload.timestamp || new Date().toISOString(),
      userId: payload.userId.toLowerCase(),
      email: payload.userId.toLowerCase(),
      name: payload.name || 'User',
      rating: payload.rating,
      comment: payload.comment
    };

    await fetch(`${CENTRAL_ADMIN_WEB_APP_URL}?sheetName=Reviews`, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });
    return true;
  } catch (error) {
    console.warn('Central admin review track warning (handled):', error);
    return false;
  }
}
