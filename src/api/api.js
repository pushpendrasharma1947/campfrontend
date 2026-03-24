import axios from "axios";

const TOKEN_KEY = "campuskart_token";

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken();

if (token && config.headers) {
  config.headers.Authorization = `Bearer ${token}`;
}

  return config;
});

export async function fetchItems(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.min_price !== undefined && filters.min_price !== null && filters.min_price !== "") {
    params.set("min_price", String(filters.min_price));
  }
  if (filters.max_price !== undefined && filters.max_price !== null && filters.max_price !== "") {
    params.set("max_price", String(filters.max_price));
  }

  const queryString = params.toString();
  const url = queryString ? `/items?${queryString}` : "/items";
  const { data } = await api.get(url);
  return data?.items ?? data ?? [];
}

export async function fetchItem(id) {
  const { data } = await api.get(`/items/${id}`);
  return data?.item ?? data;
}

export async function createItem(item) {
  const { data } = await api.post("/items", item);
  return data;
}

export async function updateItem(id, item) {
  const { data } = await api.patch(`/items/${id}`, item);
  return data;
}

export async function deleteItem(id) {
  const { data } = await api.delete(`/items/${id}`);
  return data;
}

export async function fetchConversation(id) {
  const { data } = await api.get(`/conversations/${id}`);
  return data;
}

export async function sendChatMessage(conversationId, message) {
  const { data } = await api.post("/chat", { conversationId, message });
  return data;
}

export default api;
