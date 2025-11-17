import { authorizedFetch } from "../index";

// ✅ Получить тикет по ID
export const fetchTicketByIdApi = async (id) => {
  const res = await authorizedFetch(`/tickets/${id}`, {
    method: "GET",
    headers: {
      "Accept-Language": "UZ",
    },
  });

  if (!res) throw new Error("Failed to fetch ticket");
  return res; // возвращаем JSON
};

// ✅ Обновить тикет по ID (PUT)
export const updateTicketByIdApi = async (id, data) => {
  const res = await authorizedFetch(`/tickets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
    },
    body: JSON.stringify(data),
  });

  if (!res) throw new Error("Failed to update ticket");
  return res; // возвращаем JSON
};

// ✅ Обновить департамент тикета (PATCH /tickets/{id}/department)
export const updateTicketDepartmentApi = async (id, department) => {
  const res = await authorizedFetch(`/tickets/${id}/department`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
    },
    body: JSON.stringify({ department }),
  });

  if (!res) throw new Error("Failed to update ticket department");
  return res; // возвращаем JSON
};

// ✅ Обновить приоритет тикета (PATCH /tickets/{id}/priority)
export const updateTicketPriorityApi = async (id, priority) => {
  const res = await authorizedFetch(`/tickets/${id}/priority`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
    },
    body: JSON.stringify({ priority }),
  });

  if (!res) throw new Error("Failed to update ticket priority");
  return res; // возвращаем JSON
};