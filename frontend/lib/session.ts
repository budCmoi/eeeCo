import type { UserProfile } from '@/types';

const sessionKey = 'eeeco_token';

function setCookie(name: string, value: string, maxAge = 60 * 60 * 24 * 7) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function persistSession(token: string, user: UserProfile) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(sessionKey, token);
  setCookie('eeeco_session', '1');
  setCookie('eeeco_role', user.role);
  setCookie('eeeco_email', encodeURIComponent(user.email));
}

export function clearPersistedSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(sessionKey);
  document.cookie = 'eeeco_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'eeeco_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'eeeco_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function getStoredToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(sessionKey);
}