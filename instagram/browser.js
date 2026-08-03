const { chromium } = require("playwright");

async function launchInstagram() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const context = await browser.newContext({
    storageState: "auth/state.json",
  });

  const page = await context.newPage();

  await page.goto("https://www.instagram.com/direct/inbox/");
  await page.waitForLoadState("networkidle");

  return {
    browser,
    context,
    page,
  };
}

async function openChat(page, friendName) {
  const buttons = page.getByRole("button");

  const count = await buttons.count();

  for (let i = 0; i < count; i++) {
    const text = await buttons.nth(i).textContent();

    if (!text) continue;

    if (text.includes(friendName)) {
      console.log(`Opening ${friendName}...`);

      await buttons.nth(i).click();

      await page.waitForLoadState("networkidle");

      return true;
    }
  }

  throw new Error(`Chat "${friendName}" not found.`);
}

async function closeInstagram(browser) {
  if (browser) {
    await browser.close();
  }
}

module.exports = {
  launchInstagram,
  openChat,
  closeInstagram,
};
