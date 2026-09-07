const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

type ThumbnailQuality = "maxresdefault" | "hqdefault" | "mqdefault";

// Extracts the 11-character video id from any common YouTube link form
// (youtu.be/<id>, watch?v=<id>, embed/<id>, shorts/<id>) or a bare id.
// Any extra query params (si, list, index, t, feature, …) are ignored.
const getYouTubeId = (url: string): string | null => {
  const trimmed = url?.trim();
  if (!trimmed) return null;

  if (YOUTUBE_ID_PATTERN.test(trimmed)) return trimmed;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  const segments = parsed.pathname.split("/").filter(Boolean);

  let candidate: string | null = null;

  if (host === "youtu.be") {
    candidate = segments[0] ?? null;
  } else if (YOUTUBE_HOSTS.has(host)) {
    if (segments[0] === "watch") {
      candidate = parsed.searchParams.get("v");
    } else if (segments[0] === "embed" || segments[0] === "shorts") {
      candidate = segments[1] ?? null;
    }
  }

  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
};

// Builds the canonical embed URL used by the tutorial iframes.
const getYouTubeEmbedUrl = (url: string): string | null => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

// Builds a thumbnail URL. maxresdefault is the crispest but is not generated
// for every video; callers should fall back to hqdefault (always present) if
// the image fails to load.
const getYouTubeThumbnail = (
  url: string,
  quality: ThumbnailQuality = "maxresdefault",
): string | null => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null;
};

export { getYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail };
