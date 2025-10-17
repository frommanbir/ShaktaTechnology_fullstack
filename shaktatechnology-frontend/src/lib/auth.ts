export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("auth_token");
  return !!token;
};

export const requireAuth = (redirectTo: string = "/login") => {
  if (typeof window !== "undefined" && !isAuthenticated()) {
    window.location.href = redirectTo;
  }
};