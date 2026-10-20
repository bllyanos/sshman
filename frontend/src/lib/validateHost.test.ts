import { describe, expect, it } from "vitest";
import { isValid, validateHost } from "./validateHost";

const base = { alias: "a", hostName: "", user: "", port: "", identityFile: "", options: [] };

describe("validateHost", () => {
  it("accepts minimal host", () => expect(isValid(validateHost(base))).toBe(true));
  it("requires alias", () => expect(validateHost({ ...base, alias: "" }).alias).toBeDefined());
  it("rejects wildcard alias", () => expect(validateHost({ ...base, alias: "a*" }).alias).toBeDefined());
  it("checks port range", () => {
    expect(validateHost({ ...base, port: "0" }).port).toBeDefined();
    expect(validateHost({ ...base, port: "abc" }).port).toBeDefined();
    expect(validateHost({ ...base, port: "2222" }).port).toBeUndefined();
  });
  it("allows spaces in identity file", () =>
    expect(isValid(validateHost({ ...base, identityFile: "~/.ssh/my key" }))).toBe(true));
  it("rejects modeled keys as options", () =>
    expect(validateHost({ ...base, options: [{ key: "HostName", value: "x" }] }).options).toBeDefined());
});
