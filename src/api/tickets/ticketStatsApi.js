import { authorizedFetch } from "../index";

// 🔹 Общая статистика по тикетам
export const fetchTicketStatusStatsApi = async () => {
  const res = await authorizedFetch("/tickets/stats/status", {
    method: "GET",
    headers: { "Accept-Language": "UZ" },
  });
  return res;
};

// 🔹 Статистика по категориям и статусам
export const fetchTicketCategoryStatsApi = async () => {
  const res = await authorizedFetch("/tickets/stats/category-status", {
    method: "GET",
    headers: { "Accept-Language": "UZ" },
  });
  return res;
};