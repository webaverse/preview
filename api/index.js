import chrome from 'chrome-aws-lambda'
import {chromium} from 'playwright-core'

const handleScreenshot = async ({ params, url }) => {
  const browser = await chromium.launch({
    args: chrome.args,
    executablePath:
      process.env.NODE_ENV !== 'development'
        ? await chrome.executablePath
        : '/bin/chromium',
    headless: true,
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  })

  await page.goto(url)

  const buffer = await page.screenshot({ type: 'png' })

  await page.close()
  await browser.close()

  return buffer
}

export default async (req, reply) => {
  let {url} = req.query

  if (url) {
    const imageBuffer = await handleScreenshot({
      params: req.query,
      url,
    });
    reply.setHeader('Content-Type', 'image/png');
    reply.send(imageBuffer);
  } else {
    res.send(400);
  }
}
