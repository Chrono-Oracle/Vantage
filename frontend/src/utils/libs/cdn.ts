const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const imgUrl = (path: string | null | undefined) => {
  if (!path) return "";
  return `${API_URL}/${path.replace(/^\/+/, "")}`;
};

