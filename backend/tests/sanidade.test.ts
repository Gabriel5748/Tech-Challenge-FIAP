import { describe, it, expect } from "vitest";

describe("sanidade", () => {
  it("o Vitest está rodando no CI", () => {
    expect(1 + 1).toBe(2);
  });
});