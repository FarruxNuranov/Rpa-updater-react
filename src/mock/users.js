// Simple in-memory fake users database and search helper

export const FAKE_USERS = [
  {
    id: 1,
    fullName: "Xumoyunmirzo Yakubjonov",
    username: "xumoyunmirzo",
    email: "xumoyunmirzo@example.com",
    avatarUrl: "",
  },
  {
    id: 2,
    fullName: "Farrux Nuranov",
    username: "farrux",
    email: "farrux@example.com",
    avatarUrl: "",
  },
  {
    id: 3,
    fullName: "Shahzod Nematov",
    username: "shahzod",
    email: "shahzod@example.com",
    avatarUrl: "",
  },
  {
    id: 4,
    fullName: "Alex Johnson",
    username: "alexj",
    email: "alexj@example.com",
    avatarUrl: "",
  },
  {
    id: 5,
    fullName: "Sara Lee",
    username: "saralee",
    email: "sara@example.com",
    avatarUrl: "",
  },
];

export function searchUsersLocal(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  return FAKE_USERS.filter((u) => {
    const hay = `${u.fullName} ${u.username} ${u.email}`.toLowerCase();
    return hay.includes(q);
  });
}
