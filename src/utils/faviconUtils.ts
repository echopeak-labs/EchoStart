/**
 * Extracts domain from URL
 */
export const extractDomain = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
};

/**
 * Gets favicon URL for a given website URL
 * Uses Google's favicon service as it's reliable and fast
 */
export const getFaviconUrl = (url: string, size: number = 128): string | null => {
  const domain = extractDomain(url);
  if (!domain) return null;
  
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
};

/**
 * Fetches and validates a favicon URL
 */
export const fetchFavicon = async (url: string): Promise<string | null> => {
  const faviconUrl = getFaviconUrl(url);
  if (!faviconUrl) return null;

  try {
    const response = await fetch(faviconUrl);
    if (response.ok) {
      return faviconUrl;
    }
  } catch (error) {
    console.error('Error fetching favicon:', error);
  }

  return null;
};
