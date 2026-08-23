const STORAGE_KEY = 'ft3d_premium_users_v1';

export function getIsPremium(email?: string): boolean {
  if (!email) return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const premiumEmails: string[] = stored ? JSON.parse(stored) : [];
    // Convert to lowercase for uniform comparison
    return premiumEmails.includes(email.toLowerCase());
  } catch (e) {
    console.error('Error checking premium status:', e);
    return false;
  }
}

export function setIsPremium(email: string, status: boolean): void {
  if (!email) return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let premiumEmails: string[] = stored ? JSON.parse(stored) : [];
    premiumEmails = premiumEmails.map(e => e.toLowerCase());

    const targetEmail = email.toLowerCase();
    if (status) {
      if (!premiumEmails.includes(targetEmail)) {
        premiumEmails.push(targetEmail);
      }
    } else {
      premiumEmails = premiumEmails.filter(e => e !== targetEmail);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(premiumEmails));

    // Dispatch custom event to notify App component in real-time
    const event = new CustomEvent('daily_expense_premium_updated', {
      detail: { userId: targetEmail, isPremium: status }
    });
    window.dispatchEvent(event);
  } catch (e) {
    console.error('Error saving premium status:', e);
  }
}
