/**
 * The card send. A real local HTTP server stands where the sound package's
 * receiver stands; nothing is mocked.
 * Run: node --experimental-strip-types --test src/lib/audio/sound-live.test.ts
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { describe, it } from "node:test";
import { eventToSoundCard, postSoundCard, soundEndpoint } from "./sound-live.ts";
import { VocalTracker, type VocalEvent } from "./vocalization.ts";

function closedGroan(): VocalEvent {
  const t = new VocalTracker();
  let ev = null as ReturnType<VocalTracker["step"]>;
  for (let i = 0; i < 36; i++) ev = t.step(i * 16, 0.08, 0.03, 130, 400, 1200) ?? ev;
  ev = t.step(36 * 16, 0.001, 0.03, null, 400, 1200) ?? ev;
  assert.ok(ev, "event should close");
  return ev;
}

function closedHiss(): VocalEvent {
  const t = new VocalTracker();
  let ev = null as ReturnType<VocalTracker["step"]>;
  for (let i = 0; i < 14; i++) ev = t.step(i * 16, 0.06, 0.2, null, 0, 0) ?? ev;
  ev = t.step(14 * 16, 0.001, 0.2, null, 0, 0) ?? ev;
  assert.ok(ev, "event should close");
  return ev;
}

async function receiver(status: number) {
  const seen: { path: string; method: string; type: string; body: string }[] = [];
  const server = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      seen.push({
        path: req.url ?? "",
        method: req.method ?? "",
        type: String(req.headers["content-type"]),
        body,
      });
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end("{}");
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const port = (server.address() as AddressInfo).port;
  return {
    seen,
    url: `http://127.0.0.1:${port}/api/sound/corti-event`,
    close: () => new Promise<void>((r) => server.close(() => r())),
  };
}

describe("sound card", () => {
  it("carries the measurements and the whole tape", () => {
    const ev = closedGroan();
    const card = eventToSoundCard(ev);
    assert.equal(card.organ, "corti");
    assert.equal(card.durationMs, ev.durationMs);
    assert.equal(card.peakRms, ev.peakRms);
    assert.equal(card.f0, ev.f0);
    assert.equal(card.startedAt, ev.startedAt);
    assert.deepEqual(card.tape, ev.tape);
    assert.equal(card.truncated, false);
  });

  it("kind does not cross", () => {
    const card = eventToSoundCard(closedGroan()) as Record<string, unknown>;
    assert.equal("kind" in card, false);
  });

  it("no lock stays null, never a number", () => {
    const card = eventToSoundCard(closedHiss());
    assert.equal(card.f0, null);
    assert.equal(card.voiced, false);
    assert.ok(card.tape.every((f) => f.f0 === null));
    assert.ok(JSON.stringify(card).includes('"f0":null'));
  });

  it("says when the tape hit the cap", () => {
    const t = new VocalTracker();
    let ev = null as ReturnType<VocalTracker["step"]>;
    for (let i = 0; i < 400; i++) ev = t.step(i * 16, 0.08, 0.03, 130, 400, 1200) ?? ev;
    ev = t.step(400 * 16, 0.001, 0.03, null, 400, 1200) ?? ev;
    assert.ok(ev);
    assert.equal(eventToSoundCard(ev).truncated, true);
  });
});

describe("card send", () => {
  it("defaults to the sound package receiver on 5486", () => {
    assert.equal(soundEndpoint(), "http://127.0.0.1:5486/api/sound/corti-event");
  });

  it("posts the closed card as JSON to the receiver", async () => {
    const rx = await receiver(200);
    try {
      const ev = closedGroan();
      assert.equal(await postSoundCard(ev, rx.url), true);
      assert.equal(rx.seen.length, 1);
      const got = rx.seen[0]!;
      assert.equal(got.method, "POST");
      assert.equal(got.path, "/api/sound/corti-event");
      assert.match(got.type, /application\/json/);
      assert.deepEqual(JSON.parse(got.body), JSON.parse(JSON.stringify(eventToSoundCard(ev))));
    } finally {
      await rx.close();
    }
  });

  it("a refusal is false, not a quiet success", async () => {
    const rx = await receiver(403);
    try {
      assert.equal(await postSoundCard(closedGroan(), rx.url), false);
    } finally {
      await rx.close();
    }
  });

  it("no receiver is false, and does not throw", async () => {
    assert.equal(
      await postSoundCard(closedGroan(), "http://127.0.0.1:9/api/sound/corti-event"),
      false,
    );
  });
});
