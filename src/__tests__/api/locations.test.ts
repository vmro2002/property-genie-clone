import handler from "@/pages/api/locations";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Creates a minimal mock of NextApiRequest.
 */
function makeReq(query: Record<string, string | string[]>): NextApiRequest {
  return { query, method: "GET" } as unknown as NextApiRequest;
}

/**
 * Creates a spy-based mock of NextApiResponse that captures the status code
 * and JSON body so we can assert on them.
 */
function makeRes() {
  const res = {
    _status: 0,
    _body: undefined as unknown,
    status(code: number) {
      this._status = code;
      return this;
    },
    json(body: unknown) {
      this._body = body;
      return this;
    },
  };
  return res as unknown as NextApiResponse & {
    _status: number;
    _body: unknown;
  };
}

describe("GET /api/locations", () => {
  it("returns 400 when keyword param is missing", async () => {
    const req = makeReq({});
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
    expect((res._body as any).error).toMatch(/keyword/i);
  });

  it("returns 400 when keyword is an array (not a string)", async () => {
    const req = makeReq({ keyword: ["kl", "pj"] });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
  });

  it("proxies a 200 response from the upstream API", async () => {
    const upstreamData = [{ type: "City", title: "Kuala Lumpur", slug: "kuala-lumpur" }];
    fetchMock.mockResponseOnce(JSON.stringify(upstreamData), { status: 200 });

    const req = makeReq({ keyword: "kuala" });
    const res = makeRes();
    await handler(req, res);

    expect(res._status).toBe(200);
    expect(res._body).toEqual(upstreamData);
  });

  it("proxies the upstream error status code on a non-ok response", async () => {
    fetchMock.mockResponseOnce("Service Unavailable", { status: 503 });

    const req = makeReq({ keyword: "kuala" });
    const res = makeRes();
    await handler(req, res);

    expect(res._status).toBe(503);
    expect((res._body as any).error).toMatch(/upstream/i);
  });

  it("returns 500 when fetch throws a network error", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    const req = makeReq({ keyword: "kuala" });
    const res = makeRes();
    await handler(req, res);

    expect(res._status).toBe(500);
    expect((res._body as any).error).toMatch(/internal server error/i);
  });

  it("URL-encodes the keyword before forwarding to upstream", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    const req = makeReq({ keyword: "mont kiara" });
    const res = makeRes();
    await handler(req, res);

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("mont%20kiara");
  });
});
