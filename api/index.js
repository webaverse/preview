import chrome from 'chrome-aws-lambda'
import { chromium } from 'playwright-core'
// import { serverTiming } from './../lib/helpers.js'

const app = express();

const handleScreenshot = async ({ params, url }) => {
  // const { colorScheme, skipCookieBannerClick } = params

  // serverTiming.start()
  // serverTiming.measure('browserStart')
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
  // serverTiming.measure('browserStart')
  // serverTiming.measure('pageView')
  // if (colorScheme) {
    // await page.emulateMedia({ colorScheme })
  // }
  await page.goto(url)
  // serverTiming.measure('pageView')

  // serverTiming.measure('screenshot')
  // Snap screenshot
  const buffer = await page.screenshot({ type: 'png' })
  // serverTiming.measure('screenshot')

  await page.close()
  await browser.close()

  return buffer
}

export default async (req, reply) => {
  let { url } = req.query

  // Set the `s-maxage` property to cache at the CDN layer
  // reply.header('Cache-Control', 's-maxage=31536000, public')
  // reply.header('Content-Type', 'image/png')

  // Generate Server-Timing headers
  const imageBuffer = await handleScreenshot({ params: req.query, url })
  // reply.header('Server-Timing', serverTiming.setHeader())
  reply.setHeader('Content-Type', 'image/png')
  reply.send(imageBuffer)
}
