export default function myLoader({ src, width, quality }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.businessdayafrica.net";

  // getImageUrl() returns a full absolute URL like
  // "https://api.businessdayafrica.net/uploads/example.jpg". Strip it
  // down to the relative filename the resize endpoint expects.
  let relativePath = src;
  try {
    const url = new URL(src);
    relativePath = url.pathname.replace(/^\/uploads\//, "");
  } catch {
    relativePath = src.replace(/^\/?(uploads\/)?/, "");
  }

  return `${apiUrl}/uploads-resized?src=${encodeURIComponent(relativePath)}&w=${width}&q=${quality || 75}`;
}