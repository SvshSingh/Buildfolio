import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "./site-url";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSiteUrl", () => {
  it("returns the configured origin unchanged", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.vercel.app");
    expect(getSiteUrl()).toBe("https://example.vercel.app");
  });

  it("strips a single trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.vercel.app/");
    expect(getSiteUrl()).toBe("https://example.vercel.app");
  });

  it("strips repeated trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.vercel.app///");
    expect(getSiteUrl()).toBe("https://example.vercel.app");
  });

  it("falls back to localhost when unset", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("keeps path segments while dropping the trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com/app/");
    expect(getSiteUrl()).toBe("https://example.com/app");
  });

  it("builds a callback URL with exactly one slash", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.vercel.app/");
    expect(`${getSiteUrl()}/auth/callback`).toBe(
      "https://example.vercel.app/auth/callback"
    );
  });
});
