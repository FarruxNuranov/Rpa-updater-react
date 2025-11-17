/**
 * 🔹 Логин по email и паролю
 * Возвращает { accessToken, expireDate }
 */
export const loginApi = async ({ email, password }) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed");
  return response.json();
};