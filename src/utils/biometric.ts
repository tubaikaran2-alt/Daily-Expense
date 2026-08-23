import { AuthUser } from '../types';

export interface BiometricConfig {
  enabled: boolean;
  user: AuthUser | null;
}

const STORAGE_KEY = 'ft3d_biometric_config_v1';

export function getSavedBiometricConfig(): BiometricConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse biometric config:', e);
  }
  return {
    enabled: false,
    user: null
  };
}

export function setSavedBiometricConfig(enabled: boolean, user: AuthUser | null): void {
  try {
    const config: BiometricConfig = { enabled, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save biometric config:', e);
  }
}
