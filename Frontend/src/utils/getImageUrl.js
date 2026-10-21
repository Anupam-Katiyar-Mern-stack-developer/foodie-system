const getImageUrl = (image) => {
  if (typeof image !== "string" || !image.trim()) return "";
  const value = image.trim().replaceAll("\\", "/");
  if (/^(https?:|blob:|data:image\/)/i.test(value)) return value;
  if (value.startsWith("/assets/") || value.startsWith("/src/") || value.startsWith("/@")) return value;
  const configured = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  try {
    const origin = new URL(configured, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173').origin;
    const path = value.startsWith("/") ? value : `/${value}`;
    return new URL(path, origin).href;
  } catch { return ""; }
};

export default getImageUrl;
