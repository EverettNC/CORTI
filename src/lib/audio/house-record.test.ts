import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { earFromFrame } from "./house-record.ts";

describe("Corti house ear", () => {
  it("silence is not a note", () => {
    const ear = earFromFrame({
      listening: true,
      rms: 0.001,
      zcr: 0.4,
      f0: null,
    });
    assert.equal(ear.locked, false);
    assert.equal(ear.f0, null);
  });

  it("a lock only stands when listening", () => {
    const off = earFromFrame({
      listening: false,
      rms: 0.04,
      zcr: 0.1,
      f0: 220,
    });
    assert.equal(off.locked, false);
    assert.equal(off.f0, null);
  });
});
