import { describe, expect, it } from "vitest";
import { filterHosts } from "./hostFilter";

const hosts = [
  { alias: "work-db", hostName: "10.0.0.5", user: "deploy" },
  { alias: "personal", hostName: "vps.example.com", user: "billy" },
];

describe("filterHosts", () => {
  it("returns all for empty query", () => expect(filterHosts(hosts, "  ")).toHaveLength(2));
  it("matches case-insensitively across fields", () =>
    expect(filterHosts(hosts, "EXAMPLE").map((h) => h.alias)).toEqual(["personal"]));
  it("requires every term", () => {
    expect(filterHosts(hosts, "work deploy")).toHaveLength(1);
    expect(filterHosts(hosts, "work billy")).toHaveLength(0);
  });
});
