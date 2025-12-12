export const resolveImageUrl = (imageUrl: string) => {
  if (!imageUrl) return "";
  return imageUrl.startsWith("http")
    ? imageUrl
    : `${import.meta.env.VITE_API_URL}${imageUrl}`;
};