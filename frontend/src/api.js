// All backend calls live here
const BASE = import.meta.env.VITE_API_URL || "";

async function post(path, payload) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export const extractJob = (jobText, jobLink) =>
  post("/api/extract", { jobText, jobLink });

export const buildTemplate = (details) => post("/api/template", details);

export const sendEmail = (to, subject, body) =>
  post("/api/send", { to, subject, body });
