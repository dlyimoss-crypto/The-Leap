import { describe, expect, it } from "vitest";
import { parsePriceCents } from "./book-price";

describe("parsePriceCents", () => {
  it("treats blank as free", () => {
    expect(parsePriceCents("")).toBeNull();
    expect(parsePriceCents("   ")).toBeNull();
  });

  it("treats zero as free", () => {
    expect(parsePriceCents("0")).toBeNull();
    expect(parsePriceCents("0.00")).toBeNull();
    expect(parsePriceCents("0.001")).toBeNull();
  });

  it("treats invalid or negative input as free", () => {
    expect(parsePriceCents("abc")).toBeNull();
    expect(parsePriceCents("-5")).toBeNull();
  });

  it("converts a real price to cents", () => {
    expect(parsePriceCents("4.99")).toBe(499);
    expect(parsePriceCents(" 10 ")).toBe(1000);
  });
});
