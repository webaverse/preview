// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default function handler(req, res) {
  const options = {
    args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  };
  console.log("trying to execute");
  const browser = await puppeteer.launch(options);
  console.log("browser launched");
  const page = await browser.newPage();
  await page.setViewport({ width: 2000, height: 1000 });
  await page.goto("https://en.wikipedia.org/", {
    waitUntil: "networkidle0",
  });
  await page.screenshot({ path: "bexer.png" });

  await browser.close();
}