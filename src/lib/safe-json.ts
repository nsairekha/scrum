export async function safeJson(response: Response) {
  if (!response) return null;
  // if not ok and no body, return null quickly
  const text = await response.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
