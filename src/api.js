const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5269";

export async function getJson(path) {
    const res = await fetch(`${BASE_URL}${path}`);
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(typeof body === "string" ? body : "Request failed");
    return body;
}

export async function postJson(path, data) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(typeof body === "string" ? body : "Request failed");
    return body;
}