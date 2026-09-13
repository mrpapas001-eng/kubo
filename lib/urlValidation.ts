export type BusinessLinkType = "website" | "instagram" | "facebook";

const CANONICAL_ORIGIN = "https://www.kuboanuncios.com";
const ALLOWED_ORIGINS = new Set([
  "https://www.kuboanuncios.com",
  "https://kuboanuncios.com",
]);

function isPrivateHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();

  if (!host || host === "localhost" || host.endsWith(".localhost")) {
    return true;
  }

  if (host === "127.0.0.1" || host === "[::1]" || host === "::1") {
    return true;
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    const parts = host.split(".").map(Number);
    if (parts.length === 4) {
      const isPrivateIPv4 =
        parts[0] === 10 ||
        parts[0] === 127 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        (parts[0] === 169 && parts[1] === 254);

      return isPrivateIPv4;
    }

    return false;
  }

  if (host.startsWith("[")) {
    return host.includes("::1") || host.includes("fc") || host.includes("fd");
  }

  return host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("172.");
}

function parseHttpUrl(input: string): URL | null {
  if (!input) return null;

  const value = input.trim();
  if (!value) return null;

  let candidate = value;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol.toLowerCase())) return null;
    if (url.username || url.password) return null;
    if (isPrivateHostname(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

export function normalizeExternalUrl(rawValue: string, type: BusinessLinkType = "website"): string {
  const value = String(rawValue ?? "").trim();
  if (!value) return "";

  const url = parseHttpUrl(value);
  if (!url) return "";

  const hostname = url.hostname.toLowerCase();

  if (type === "instagram") {
    if (hostname !== "instagram.com" && hostname !== "www.instagram.com") {
      return "";
    }
    return `https://instagram.com${url.pathname}${url.search}${url.hash}`;
  }

  if (type === "facebook") {
    const allowedFacebookHosts = new Set([
      "facebook.com",
      "www.facebook.com",
      "web.facebook.com",
      "m.facebook.com",
    ]);

    if (!allowedFacebookHosts.has(hostname)) {
      return "";
    }

    return `https://${hostname}${url.pathname}${url.search}${url.hash}`;
  }

  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    return "";
  }

  return url.toString();
}

export function normalizeNotificationTarget(rawValue: string | undefined | null): string {
  const value = String(rawValue ?? "").trim();

  if (!value) {
    return `${CANONICAL_ORIGIN}/`;
  }

  const lowerValue = value.toLowerCase();
  if (lowerValue.startsWith("javascript:") || lowerValue.startsWith("data:") || lowerValue.startsWith("file:") || lowerValue.startsWith("blob:")) {
    return `${CANONICAL_ORIGIN}/`;
  }

  if (lowerValue.startsWith("/")) {
    return new URL(value, CANONICAL_ORIGIN).toString();
  }

  try {
    const parsed = new URL(value);
    const protocol = parsed.protocol.toLowerCase();

    if (!['http:', 'https:'].includes(protocol)) {
      return `${CANONICAL_ORIGIN}/`;
    }

    if (parsed.username || parsed.password) {
      return `${CANONICAL_ORIGIN}/`;
    }

    if (isPrivateHostname(parsed.hostname)) {
      return `${CANONICAL_ORIGIN}/`;
    }

    if (!ALLOWED_ORIGINS.has(parsed.origin.toLowerCase())) {
      return `${CANONICAL_ORIGIN}/`;
    }

    return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, CANONICAL_ORIGIN).toString();
  } catch {
    return `${CANONICAL_ORIGIN}/`;
  }
}
