import { authorizedFetch } from "../index";

export const askAiApi = async ({ prompt, ticketId, userId }) => {
  const res = await authorizedFetch(`/tickets/ask-ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
    },
    body: JSON.stringify({ prompt, ticketId, userId }),
  });

  if (!res || !res.response) {
    throw new Error("Failed to get AI response");
  }

  return res; // { response: "...", suggestions: [...] }
};

export const fetchAiHistoryApi = async (ticketId) => {
  const res = await authorizedFetch(`/tickets/${ticketId}/ai-history`, {
    method: "GET",
    headers: {
      "Accept-Language": "UZ",
    },
  });

  if (!res) {
    throw new Error("Failed to fetch AI history");
  }

  return res; // Array of { id, prompt, response, timestamp, suggestions }
};