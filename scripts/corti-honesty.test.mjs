/**
 * Rule 13 scanner + live preview check.
 * Fails if Corti starts fabricating the numbers the SDK used to.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const SRC = "/workspace/src";

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx|js|mjs)$/.test(name) && !name.endsWith(".test.ts")) acc.push(p);
  }
  return acc;
}

const files = walk(SRC).map((p) => ({
  path: p,
  text: readFileSync(p, "utf8"),
}));

describe("source honesty", () => {
  it("does not return the 0.14-per-label fallback", () => {
    for (const f of files) {
      assert.ok(
        !/:\s*0\.14\b/.test(f.text) && !/=\s*0\.14\b/.test(f.text),
        `0.14 leak in ${f.path}`,
      );
    }
  });
  it("does not hardcode ToneScore 85 / arousal 88 / valence 22", () => {
    const bad = /return\s+\{\s*tone_score:\s*85|return\s+88\.0|return\s+22\.0|return 0\.05\s*;\s*\/\/ Placeholder/;
    for (const f of files) {
      assert.ok(!bad.test(f.text), `Riley stub leaked into ${f.path}`);
    }
  });
  it("does not stamp MOS 4.5 or similarity 0.95", () => {
    for (const f of files) {
      assert.ok(!/naturalness_mos:\s*4\.5/.test(f.text), f.path);
      assert.ok(!/speaker_similarity:\s*0\.95/.test(f.text), f.path);
    }
  });
  it("does not invent 150 Hz as a default F0", () => {
    for (const f of files) {
      assert.ok(
        !/f0\s*=\s*150|freq\s*=\s*150|return 150/.test(f.text),
        `150 Hz default in ${f.path}`,
      );
    }
  });
  it("does not random-pick a transcript", () => {
    for (const f of files) {
      assert.ok(
        !/random\.choice|sample_phrases|Math\.random\(\).*phrase/i.test(f.text),
        `random speech in ${f.path}`,
      );
    }
  });
});

describe("live preview", () => {
  it("renders, locks C4, stays honest on silence, no console errors", async () => {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const errors = [];
    try {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      const res = await page.goto("http://127.0.0.1:8080/", {
        waitUntil: "networkidle",
        timeout: 45000,
      });
      assert.equal(res?.status(), 200);
      await page.getByTestId("open-cochlea").click();
      await page.waitForTimeout(400);
      const wake = (await page.getByTestId("note-name").innerText()).trim();
      assert.ok(/^[A-G][♯♭]?[0-8]$|^—$/.test(wake), `wake note=${wake}`);
      await page.waitForTimeout(1600);
      const quiet = (await page.getByTestId("note-name").innerText()).trim();
      assert.equal(quiet, "—", "after wake, silence must be a dash, not a note");

      const key = page.locator('[data-testid="key-60"]:visible');
      assert.ok(await key.count(), "C4 key missing");
      await key.dispatchEvent("pointerdown");
      await page.waitForTimeout(320);
      const held = (await page.getByTestId("note-name").innerText()).trim();
      assert.equal(held, "C4", `held C4, got ${held}`);
      await key.dispatchEvent("pointerup");

      await page.getByTestId("mode-tone").click();
      await page.waitForTimeout(250);
      const body = await page.locator("body").innerText();
      assert.match(body, /christman_dsp\.c/i);
      assert.match(body, /Jitter/i);
      assert.match(body, /Shimmer/i);
      assert.match(body, /HNR/);
      assert.match(body, /NO_VECTOR|VAD/i);
      assert.match(body, /COLD/);
      assert.doesNotMatch(body, /Anger:\s*94|94%\s*anger/i);
      assert.doesNotMatch(body, /tone_score:\s*85/i);
      assert.doesNotMatch(body, /MOS\s*4\.5/i);
      assert.doesNotMatch(body, /DISSOCIATIVE_SILENCE/);
      assert.doesNotMatch(body, /RED_SMEAR_DETECTED/);

      const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
      mobile.on("pageerror", (e) => errors.push("mobile:" + String(e)));
      await mobile.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 45000 });
      const overflow = await mobile.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      assert.ok(overflow <= 1, `horizontal overflow ${overflow}px`);

      assert.deepEqual(errors, [], `console errors:\n${errors.join("\n")}`);

      await page.getByTestId("mode-train").click();
      await page.waitForTimeout(200);
      assert.equal(await page.getByTestId("train-reveal").count(), 0);
      await page.getByTestId("train-next").click();
      await page.waitForTimeout(500);
      await page.getByTestId("train-pc-0").click();
      await page.waitForTimeout(200);
      const reveal = (await page.getByTestId("train-reveal").innerText()).trim();
      assert.match(reveal, /^It was /);
      assert.doesNotMatch(reveal, /94%/);
    } finally {
      await browser.close();
    }
  });
});
