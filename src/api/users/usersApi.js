import { authorizedFetch } from "../index";
import config from "../../config/config";

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

export async function deleteUser(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${config.API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Accept-Language": "UZ",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch {
      /* no body */
    }
    throw new Error(data?.message || `API error: ${res.status}`);
  }
  return { status: res.status };
}

export async function getUsers({
  skip = 0,
  take = 50,
  sortPropName,
  sortDirection,
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
  return authorizedFetch(`/users${query}`, {
    method: "GET",
    headers: acceptLanguage ? { "Accept-Language": acceptLanguage } : undefined,
  });
}

export async function getUserById(id, { acceptLanguage = "UZ" } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${config.API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      "Accept-Language": acceptLanguage,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `API error: ${res.status}`);
  }
  return { status: res.status, data };
}

export async function changeUserPassword(id, password, { acceptLanguage = "UZ" } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${config.API_URL}/users/${id}/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": acceptLanguage,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ password }),
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `API error: ${res.status}`);
  }
  return { status: res.status, data };
}

export async function createUser(body) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${config.API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `API error: ${res.status}`);
  }
  return { status: res.status, data };
}

export async function updateUser(id, body) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${config.API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "UZ",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `API error: ${res.status}`);
  }
  return { status: res.status, data };
}
