import { describe, it, expect, vi, afterEach } from "vitest";
import { api, ApiError } from "@/lib/api";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("api", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("mengirim GET dengan query params dan melewatkan undefined", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    const data = await api.get<{ ok: boolean }>("/items", {
      params: { page: 2, q: undefined },
    });

    expect(data.ok).toBe(true);
    expect(fetchMock.mock.calls[0][0]).toBe("/items?page=2");
  });

  it("mengirim POST dengan body JSON", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 1 }, 201));
    vi.stubGlobal("fetch", fetchMock);

    await api.post("/items", { nama: "Budi" });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ nama: "Budi" }));
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("melempar ApiError dengan status dan message dari server", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ message: "Tidak ditemukan" }, 404)));

    const promise = api.get("/items/99");

    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({ status: 404, message: "Tidak ditemukan" });
  });
});
