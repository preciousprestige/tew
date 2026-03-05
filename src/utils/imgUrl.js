// Helper to resolve image URLs from backend
export const imgUrl = (src) => {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;
  return (process.env.REACT_APP_API_URL || "").replace("/api", "") + src;
};
