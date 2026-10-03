import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const errors = [];

async function shot(page, name) {
  await page.screenshot({ path: new URL(`../screenshots/${name}.png`, import.meta.url).pathname, fullPage: false });
}

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("http://127.0.0.1:9243/", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(400);

  await page.getByTestId("open-cochlea").click();
  await page.waitForTimeout(500);
  const note1 = (await page.getByTestId("note-name").innerText()).trim();
  await shot(page, "corti-open");
  await page.waitForTimeout(1400);
  const note2 = (await page.getByTestId("note-name").innerText()).trim();

  const key = page.locator('[data-testid="key-60"]:visible');
  let note3 = null;
  if (await key.count()) {
    await key.dispatchEvent("pointerdown");
    await page.waitForTimeout(280);
    await shot(page, "corti-c4");
    note3 = (await page.getByTestId("note-name").innerText()).trim();
    await key.dispatchEvent("pointerup");
  }

  await page.getByTestId("mode-train").click();
  await page.waitForTimeout(200);
  await shot(page, "corti-train");
  await page.getByTestId("train-next").click();
  await page.waitForTimeout(400);
  await shot(page, "corti-train-playing");

  await page.getByTestId("mode-tone").click();
  await page.waitForTimeout(200);
  await shot(page, "corti-tone");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mobile.on("pageerror", (e) => errors.push("mobile:" + String(e)));
  mobile.on("console", (m) => {
    if (m.type() === "error") errors.push("mobile:" + m.text());
  });
  await mobile.goto("http://127.0.0.1:9243/", { waitUntil: "networkidle", timeout: 45000 });
  await mobile.waitForTimeout(400);
  const overflow = await mobile.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  await mobile.screenshot({ path: new URL("../screenshots/corti-mobile.png", import.meta.url).pathname });
  await mobile.getByTestId("open-cochlea").click();
  await mobile.waitForTimeout(600);
  await mobile.screenshot({ path: new URL("../screenshots/corti-mobile-open.png", import.meta.url).pathname });
  console.log(JSON.stringify({ note1, note2, note3, overflow, errors }, null, 2));
} finally {
  await browser.close();
}
