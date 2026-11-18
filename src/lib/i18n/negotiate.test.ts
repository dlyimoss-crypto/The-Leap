import { describe, expect, it } from "vitest";
import { localeFromAcceptLanguage } from "./negotiate";

const ALL = ["en", "sw", "de", "fr", "es", "zh-CN", "zh-TW"] as const;

describe("localeFromAcceptLanguage", () => {
  it("returns null for a missing or empty header", () => {
    expect(localeFromAcceptLanguage(null, ALL)).toBeNull();
    expect(localeFromAcceptLanguage("", ALL)).toBeNull();
  });

  it("matches a language by its primary subtag, ignoring region", () => {
    expect(localeFromAcceptLanguage("de-DE,de;q=0.9", ALL)).toBe("de");
    expect(localeFromAcceptLanguage("sw-TZ", ALL)).toBe("sw");
    expect(localeFromAcceptLanguage("fr-CA", ALL)).toBe("fr");
  });

  it("is case-insensitive", () => {
    expect(localeFromAcceptLanguage("SW-tz", ALL)).toBe("sw");
  });

  it("picks the highest-quality supported language, not the first listed", () => {
    expect(localeFromAcceptLanguage("ja;q=0.9,fr;q=0.5,es;q=0.8", ALL)).toBe("es");
  });

  it("skips unsupported languages", () => {
    expect(localeFromAcceptLanguage("ja-JP,ja;q=0.9", ALL)).toBeNull();
    expect(localeFromAcceptLanguage("ja,de;q=0.4", ALL)).toBe("de");
  });

  it("ignores languages refused with q=0 and the * wildcard", () => {
    expect(localeFromAcceptLanguage("de;q=0", ALL)).toBeNull();
    expect(localeFromAcceptLanguage("*", ALL)).toBeNull();
  });

  it("maps Traditional Chinese variants to zh-TW", () => {
    for (const tag of ["zh-TW", "zh-HK", "zh-MO", "zh-Hant", "zh-Hant-HK"]) {
      expect(localeFromAcceptLanguage(tag, ALL)).toBe("zh-TW");
    }
  });

  it("maps Simplified and bare Chinese to zh-CN", () => {
    for (const tag of ["zh", "zh-CN", "zh-SG", "zh-Hans", "zh-Hans-CN"]) {
      expect(localeFromAcceptLanguage(tag, ALL)).toBe("zh-CN");
    }
  });

  it("only returns locales from the allowed list", () => {
    expect(localeFromAcceptLanguage("de,sw;q=0.8", ["en", "sw"])).toBe("sw");
    expect(localeFromAcceptLanguage("de", ["en", "sw"])).toBeNull();
  });
});
