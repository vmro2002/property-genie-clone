import type { NextApiRequest, NextApiResponse } from "next";

// Prevent the OpenAI constructor from throwing about a missing API key —
// validation tests never reach the OpenAI call.
jest.mock("openai", () => jest.fn().mockImplementation(() => ({})));

import handler from "@/pages/api/ai-generate";

function makeReq(body: unknown): NextApiRequest {
  return { method: "POST", body } as unknown as NextApiRequest;
}

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

describe("POST /api/ai-generate — validation (422)", () => {
  it("returns 422 when description is missing from the body", async () => {
    const req = makeReq({});
    const res = makeRes();
    await handler(req, res);

    expect(res._status).toBe(422);
    expect((res._body as any).error).toBeDefined();
  });

  it("returns 422 when description is an empty string", async () => {
    const req = makeReq({ description: "" });
    const res = makeRes();
    await handler(req, res);

    expect(res._status).toBe(422);
    expect((res._body as any).error).toMatch(/description/i);
  });

  it("returns 422 when description exceeds 256 characters", async () => {
    const req = makeReq({ description: "a".repeat(257) });
    const res = makeRes();
    await handler(req, res);

    expect(res._status).toBe(422);
    expect((res._body as any).error).toMatch(/256/);
  });
});
