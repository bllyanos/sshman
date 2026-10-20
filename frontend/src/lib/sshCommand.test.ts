import { describe, expect, it } from "vitest";
import { connectAlias, hostTarget, sshCommand } from "./sshCommand";

describe("connectAlias", () => {
  it("returns plain alias", () => expect(connectAlias("box")).toBe("box"));
  it("picks first concrete pattern", () => expect(connectAlias("a* b c")).toBe("b"));
  it("is null for wildcard-only", () => expect(connectAlias("*")).toBeNull());
});

describe("sshCommand", () => {
  it("builds command", () => expect(sshCommand("box")).toBe("ssh box"));
  it("is null for Host *", () => expect(sshCommand("*")).toBeNull());
});

describe("hostTarget", () => {
  const base = { alias: "a", hostName: "", user: "", port: "" };
  it("falls back to alias", () => expect(hostTarget(base)).toBe("a"));
  it("formats all parts", () =>
    expect(hostTarget({ ...base, hostName: "h", user: "u", port: "2222" })).toBe("u@h:2222"));
  it("hides default port", () => expect(hostTarget({ ...base, hostName: "h", port: "22" })).toBe("h"));
});
