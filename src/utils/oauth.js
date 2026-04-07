import axios from "axios";
import { API_BASE_URL } from "../services/api";

/**
 * OAuth2 is driven by your backend (authorization redirect flow).
 *
 * 1) Redirect pattern (default):
 *    GET {API_BASE}/auth/oauth/{provider}?redirect_uri={frontend}/auth/callback
 *    Backend redirects to Google/GitHub, then back to redirect_uri?token=JWT
 *
 * 2) JSON URL pattern (optional):
 *    GET {API_BASE}/auth/oauth/{provider}/url?redirect_uri=...
 *    Response: { "url": "https://accounts.google.com/..." }
 */

export function buildOAuthCallbackUrl(redirectPath = "/auth/callback") {
  return `${window.location.origin}${redirectPath}`;
}

/**
 * Full-page redirect to backend OAuth entrypoint (backend then redirects to IdP).
 */
export function redirectToOAuthAuthorize(provider, options = {}) {
  const { redirectPath = "/auth/callback", extraParams = {} } = options;
  const redirectUri = buildOAuthCallbackUrl(redirectPath);
  const params = new URLSearchParams({
    redirect_uri: redirectUri,
    ...extraParams,
  });
  const url = `${API_BASE_URL}/auth/oauth/${encodeURIComponent(
    provider
  )}?${params}`;
  window.location.assign(url);
}

/**
 * Use when backend exposes a URL in JSON instead of redirecting on GET.
 */
export async function redirectToOAuthAuthorizeFromApi(provider, options = {}) {
  const { redirectPath = "/auth/callback" } = options;
  const redirectUri = buildOAuthCallbackUrl(redirectPath);
  const res = await axios.get(
    `${API_BASE_URL}/auth/oauth/${encodeURIComponent(provider)}/url`,
    {
      params: { redirect_uri: redirectUri },
    }
  );
  const url =
    res.data?.url ??
    res.data?.authorizationUrl ??
    res.data?.authorization_url;
  if (!url || typeof url !== "string") {
    throw new Error("Invalid OAuth URL response from server");
  }
  window.location.assign(url);
}

export function readOAuthTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  let token =
    params.get("token") ??
    params.get("access_token") ??
    params.get("id_token");
  if (!token && window.location.hash) {
    const raw = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const h = new URLSearchParams(raw);
    token =
      h.get("access_token") ?? h.get("token") ?? h.get("id_token");
  }
  return token;
}

export function readOAuthErrorFromUrl() {
  const params = new URLSearchParams(window.location.search);
  let err = params.get("error") ?? params.get("error_description");
  if (!err && window.location.hash) {
    const raw = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const h = new URLSearchParams(raw);
    err = h.get("error") ?? h.get("error_description");
  }
  return err;
}
