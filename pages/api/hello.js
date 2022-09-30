// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import playwright from "playwright-aws-lambda";

export default async function handler(req, res) {
  const browser = await playwright.launchChromium({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 1024 },
  });

  const page = await context.newPage();
  await page.goto("https://en.wikipedia.org/", {
    waitUntil: "networkidle0",
  });

  const buffer = await page.screenshot();

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);

  await context.close();
  await browser.close();
};