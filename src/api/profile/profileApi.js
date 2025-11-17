import { authorizedFetch } from "../index";

/**
 * Получить профиль текущего пользователя
 * GET /api/profile/me
 */
export const fetchProfileApi = async () => {
  const res = await authorizedFetch("/profile/me", {
    method: "GET",
    headers: {
      "Accept-Language": "UZ",
    },
  });

  if (!res) throw new Error("Failed to fetch profile");
  return res;
};

/**
 * Обновить профиль пользователя
 * PUT /api/profile
 * @param {Object} data - { firstName, lastName, email, avatarUrl }
 */
export const updateProfileApi = async (data) => {
  const res = await authorizedFetch("/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
    },
    body: JSON.stringify(data),
  });

  if (!res || res.error) {
    throw new Error(res?.error || "Failed to update profile");
  }

  return res;
};

/**
 * Изменить пароль
 * PUT /api/profile/change-password
 * @param {string} password - новый пароль
 */
export const changePasswordApi = async (password) => {
  const res = await authorizedFetch("/profile/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
    },
    body: JSON.stringify({ password }),
  });

  if (!res || res.error) {
    throw new Error(res?.error || "Failed to change password");
  }

  return res;
};
