import config from "../../config/config";

/**
 * Загрузка файла на сервер
 * @param {File} file - файл из input[type="file"]
 * @param {string} [language="uz"] - язык (опционально)
 * @returns {Promise<{fileName: string, url: string}>}
 */
export const uploadFileApi = async (file, language = "uz") => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    "Accept-Language": language.toUpperCase(),
  };
  // ❌ НЕ устанавливаем Content-Type вручную — браузер сам добавит multipart/form-data с boundary

  const res = await fetch(`${config.API_URL}/files/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Upload failed: ${res.status}`);
  }

  return data; // { fileName: "...", url: "..." }
};
