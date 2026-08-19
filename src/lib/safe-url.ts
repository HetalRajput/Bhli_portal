const SAFE_EXTERNAL_PROTOCOL = "https:";

export function safeExternalUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== SAFE_EXTERNAL_PROTOCOL || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}
