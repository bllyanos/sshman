import { describe, expect, it } from "vitest";
import { hostColor, hostInitials } from "./hostColor";

describe("hostColor", () => {
  it("is stable", () => expect(hostColor("abc")).toBe(hostColor("abc")));
});

describe("hostInitials", () => {
  it("uses two words", () => expect(hostInitials("work-db")).toBe("WD"));
  it("uses first two letters", () => expect(hostInitials("github.com")).toBe("GC"));
  it("single word", () => expect(hostInitials("vps")).toBe("VP"));
  it("wildcard", () => expect(hostInitials("*")).toBe("*"));
});
