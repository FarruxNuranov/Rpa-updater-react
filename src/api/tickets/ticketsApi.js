import { authorizedFetch } from "../index";

// ✅ Получить все тикеты без лимитов
export const fetchTicketsApi = async () => {
  const PAGE_SIZE = 100; // fetch 100 at a time instead of 10
  let allItems = [];
  let pageIndex = 0;

  try {
    let hasMore = true;
    while (hasMore) {
      const res = await authorizedFetch(
        `/tickets?Skip=${pageIndex * PAGE_SIZE}&Take=${PAGE_SIZE}`,
        {
          method: "GET",
          headers: {
            "Accept-Language": "UZ",
          },
        }
      );

      if (!res?.items) break;

      allItems = [...allItems, ...res.items];
      // Stop when last page (returned less than requested)
      if (res.items.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        pageIndex++;
      }
    }

    return { items: allItems };
  } catch (err) {
    console.error("fetchTicketsApi error:", err);
    return { items: [] };
  }
};

// ✅ Обновить статус тикета
export const updateTicketStatusApi = async (id, status) => {
  const res = await authorizedFetch(`/tickets/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
    },
    body: JSON.stringify({ status }),
  });

  if (!res || res.error)
    throw new Error(res?.error || "Failed to update ticket status");
  return res;
};

// ✅ Назначить тикет на текущего пользователя (по токену)
export const assignTicketApi = async (id) => {
  const res = await authorizedFetch(`/tickets/${id}/assign`, {
    method: "PATCH",
    headers: {
      "Accept-Language": "UZ",
    },
  });
  if (!res || res.error) throw new Error(res?.error || "Failed to assign ticket");
  return res;
};
