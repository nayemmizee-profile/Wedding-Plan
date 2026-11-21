export const getAdminIds = () => {
  return (process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
};

export const isAdmin = (userId) => {
  return getAdminIds().includes(userId);
};
