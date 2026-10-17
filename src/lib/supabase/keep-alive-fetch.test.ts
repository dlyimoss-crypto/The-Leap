// @vitest-environment node
import http from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { keepAliveFetch } from "./keep-alive-fetch";

let server: http.Server;
let url: string;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      res.end(
        JSON.stringify({
          contentType: req.headers["content-type"],
          body: Buffer.concat(chunks).toString("latin1"),
        }),
      );
    });
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  url = `http://localhost:${(server.address() as AddressInfo).port}`;
});

afterAll(() => {
  server.close();
});

describe("keepAliveFetch", () => {
  // Supabase Storage uploads wrap the file in the runtime's global FormData.
  it("sends a global FormData body as multipart, file included", async () => {
    const body = new FormData();
    body.append("cacheControl", "3600");
    body.append(
      "",
      new File(["%PDF-manuscript"], "book.pdf", { type: "application/pdf" }),
    );

    const res = await keepAliveFetch(url, { method: "POST", body });
    const echoed = (await res.json()) as { contentType: string; body: string };

    expect(echoed.contentType).toMatch(/^multipart\/form-data; boundary=/);
    expect(echoed.body).toContain("%PDF-manuscript");
  });

  it("still sends plain JSON bodies", async () => {
    const res = await keepAliveFetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true }),
    });
    const echoed = (await res.json()) as { body: string };

    expect(echoed.body).toBe('{"ok":true}');
  });
});
