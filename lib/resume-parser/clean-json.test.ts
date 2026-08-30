import { describe, expect, it } from "vitest";
import { cleanJsonString } from "./clean-json";

describe("cleanJsonString", () => {
  it("passes bare JSON through unchanged", () => {
    expect(cleanJsonString('{"name":"Ada"}')).toBe('{"name":"Ada"}');
  });

  it("strips a ```json fence", () => {
    expect(cleanJsonString('```json\n{"name":"Ada"}\n```')).toBe('{"name":"Ada"}');
  });

  it("strips a bare ``` fence", () => {
    expect(cleanJsonString('```\n{"name":"Ada"}\n```')).toBe('{"name":"Ada"}');
  });

  it("trims surrounding whitespace before detecting the fence", () => {
    expect(cleanJsonString('  \n```json\n{"a":1}\n```  ')).toBe('{"a":1}');
  });

  it("leaves fences that appear inside string values alone", () => {
    const payload = '{"note":"use ``` to fence code"}';
    expect(cleanJsonString(payload)).toBe(payload);
  });

  it("produces output that JSON.parse accepts", () => {
    const parsed = JSON.parse(cleanJsonString('```json\n{"skills":["a","b"]}\n```'));
    expect(parsed.skills).toEqual(["a", "b"]);
  });
});
