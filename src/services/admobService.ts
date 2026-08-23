/**
 * Google AdMob Integration Service for Android / Web
 * 
 * Replace the placeholder IDs below with your real Google AdMob IDs.
 */

// Placeholder AdMob IDs for Android (Defaulted to Google Test IDs)
export const ADMOB_CONFIG = {
  android: {
    appId: 'ca-app-pub-3940256099942544~3347511713', // Replace with your Real AdMob App ID
    bannerUnitId: 'ca-app-pub-3940256099942544/6300978111', // Replace with your Real Banner Unit ID
    interstitialUnitId: 'ca-app-pub-3940256099942544/1033173712', // Replace with your Real Interstitial Unit ID
  },
  // Interval of actions before showing an interstitial (e.g., show after every 3 transaction additions)
  interstitialActionInterval: 3,
};

class AdMobService {
  private isInitialized = false;
  private actionCount = 0;
  private isPremiumUser = false;
  private interstitialCallback: (() => void) | null = null;

  /**
   * Update the user premium status. If premium, immediately remove/prevent ads.
   */
  public setPremiumStatus(isPremium: boolean) {
    this.isPremiumUser = isPremium;
    if (isPremium) {
      this.hideNativeBanner();
    }
  }

  /**
   * Initialize AdMob for Cordova/Capacitor native environments
   */
  public initialize() {
    if (this.isInitialized || this.isPremiumUser) return;
    this.isInitialized = true;
    console.log('[AdMob] Initializing AdMob with Android App ID:', ADMOB_CONFIG.android.appId);

    // Dynamic detection of standard Capacitor / Cordova AdMob plugins on window
    const win = window as any;
    if (win.AdMob) {
      try {
        win.AdMob.initialize({
          appId: ADMOB_CONFIG.android.appId,
        });
        console.log('[AdMob] Native AdMob plugin initialized.');
      } catch (e) {
        console.error('[AdMob] Native initialization failed:', e);
      }
    }
  }

  /**
   * Triggers native AdMob banner or returns false if not in a native environment
   */
  public showNativeBanner(containerId: string): boolean {
    if (this.isPremiumUser) return false;
    this.initialize();

    const win = window as any;
    if (win.AdMob) {
      try {
        win.AdMob.showBanner({
          adId: ADMOB_CONFIG.android.bannerUnitId,
          position: 'BOTTOM_CENTER',
          autoShow: true,
        });
        console.log('[AdMob] Native banner triggered for unit:', ADMOB_CONFIG.android.bannerUnitId);
        return true;
      } catch (e) {
        console.error('[AdMob] Failed to show native banner:', e);
      }
    }
    return false;
  }

  /**
   * Hide the native AdMob banner
   */
  public hideNativeBanner() {
    const win = window as any;
    if (win.AdMob) {
      try {
        win.AdMob.hideBanner();
        console.log('[AdMob] Native banner hidden.');
      } catch (e) {
        console.error('[AdMob] Failed to hide native banner:', e);
      }
    }
  }

  /**
   * Increment action counter and check if an interstitial should be triggered.
   * Calls onShowInterstitial if we need to show one.
   */
  public incrementAction(onShowInterstitial: (onClose: () => void) => void) {
    if (this.isPremiumUser) {
      return;
    }

    this.actionCount += 1;
    console.log(`[AdMob] Action count incremented: ${this.actionCount}/${ADMOB_CONFIG.interstitialActionInterval}`);

    if (this.actionCount >= ADMOB_CONFIG.interstitialActionInterval) {
      this.actionCount = 0; // Reset counter
      this.triggerInterstitial(onShowInterstitial);
    }
  }

  /**
   * Triggers the interstitial ad flow
   */
  private triggerInterstitial(onShowInterstitial: (onClose: () => void) => void) {
    if (this.isPremiumUser) return;
    this.initialize();

    const win = window as any;
    if (win.AdMob) {
      try {
        // Prepare native interstitial
        win.AdMob.prepareInterstitial({
          adId: ADMOB_CONFIG.android.interstitialUnitId,
          autoShow: true,
        });
        console.log('[AdMob] Native interstitial prepared for unit:', ADMOB_CONFIG.android.interstitialUnitId);
        return;
      } catch (e) {
        console.error('[AdMob] Failed to trigger native interstitial:', e);
      }
    }

    // Fallback to high-fidelity HTML simulated interstitial for Web Preview / WebView
    console.log('[AdMob] Native plugin not found. Triggering simulated Web AdMob Interstitial.');
    onShowInterstitial(() => {
      console.log('[AdMob] Simulated Interstitial closed.');
    });
  }
}

export const admobService = new AdMobService();
