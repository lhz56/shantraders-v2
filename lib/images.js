const FALLBACK_IMAGE = "/placeholder.svg";

export function resolveImageUrl(imagePath) {
  if (!imagePath) {
    return FALLBACK_IMAGE;
  }

  const trimmedPath = imagePath.trim();

  try {
    if (/^https?:\/\//i.test(trimmedPath)) {
      const candidate = new URL(trimmedPath);
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        const normalized = supabaseUrl.replace(/\/+$/, "");
        const currentHost = new URL(normalized).hostname;
        if (candidate.hostname !== currentHost) {
          candidate.hostname = currentHost;
          candidate.protocol = "https:";
        }
      }
      return candidate.toString();
    }
  } catch (error) {
    console.warn("[images.resolve]", "Invalid image URL", error);
    return FALLBACK_IMAGE;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn("[images.resolve]", "Missing NEXT_PUBLIC_SUPABASE_URL env");
    return FALLBACK_IMAGE;
  }

  const normalizedBase = supabaseUrl.replace(/\/+$/, "");
  const encodedPath = trimmedPath
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${normalizedBase}/storage/v1/object/public/product-images/${encodedPath}`;
}

export { FALLBACK_IMAGE };

export function extractStoragePath(imageUrl) {
  if (!imageUrl) return null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const candidate = new URL(imageUrl, supabaseUrl);
    const pathname = candidate.pathname;
    const marker = "/storage/v1/object/public/product-images/";
    const index = pathname.indexOf(marker);
    if (index === -1) {
      return null;
    }
    return decodeURIComponent(pathname.slice(index + marker.length));
  } catch (error) {
    console.warn("[images.extract]", "Could not parse storage path", error);
    return null;
  }
}
