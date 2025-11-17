import { authorizedFetch } from "../index";

function toQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) v.forEach((x) => q.append(k, x));
    else q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function getNotifications({
  skip = 0,
  take = 100,
  sortPropName = "createdAt",
  sortDirection = 2,
  filteringExpression,
  acceptLanguage,
} = {}) {
  const query = toQuery({
    Skip: skip,
    Take: take,
    SortPropName: sortPropName,
    SortDirection: sortDirection,
    FilteringExpression: filteringExpression,
  });
  return authorizedFetch(`/notifications${query}`, {
    method: "GET",
    headers: acceptLanguage ? { "Accept-Language": acceptLanguage } : undefined,
  });
}

export async function markRead(id) {
  return authorizedFetch(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllRead() {
  return authorizedFetch(`/notifications/me/read-all`, { method: "PATCH" });
}
