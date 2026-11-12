// Small helpers used by many pages

// 12.5 -> "$12.50"  (change the symbol here to change it everywhere)
export const formatPrice = (amount) => `$${Number(amount || 0).toFixed(2)}`;

// "2026-11-12T10:00:00Z" -> "12 Nov 2026"
export const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Pulls a readable message out of a failed API call
export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";
