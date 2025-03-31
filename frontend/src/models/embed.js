import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import paths from "@/utils/paths"; // ADD THIS IMPORT - Import paths
const Embed = {
  embeds: async () => {
    return await fetch(`${API_BASE}/embeds`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.embeds || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newEmbed: async (data) => {
    return await fetch(`${API_BASE}/embeds/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { embed: null, error: e.message };
      });
  },
  updateEmbed: async (embedId, data) => {
    return await fetch(`${API_BASE}/embed/update/${embedId}`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  deleteEmbed: async (embedId) => {
    return await fetch(`${API_BASE}/embed/${embedId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (res.ok) return { success: true, error: null };
        throw new Error(res.statusText);
      })
      .catch((e) => {
        console.error(e);
        return { success: true, error: e.message };
      });
  },
  chats: async (offset = 0) => {
    return await fetch(`${API_BASE}/embed/chats`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ offset }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  deleteChat: async (chatId) => {
    return await fetch(`${API_BASE}/embed/chats/${chatId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  fetchFaqCollections: async () => {
    try {
      const res = await fetch(`/api/embed-faqs/collections`, {
        method: "GET",
        headers: baseHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Could not get embed FAQ collections", error);
      return { collections: [], error: error.message };
    }
  },
};

export default Embed;
