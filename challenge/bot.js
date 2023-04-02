require("dotenv").config();

const puppeteer = require("puppeteer");

const browserOptions = {
  headless: true,
  executablePath: "/usr/bin/chromium-browser",
  args: [
    "--no-sandbox",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-gpu",
    "--disable-sync",
    "--disable-translate",
    "--hide-scrollbars",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-first-run",
    "--safebrowsing-disable-auto-update",
    "--js-flags=--noexpose_wasm,--jitless",
  ],
};

exports.visit = async (noteId) => {
  console.log("Visiting note " + noteId)
  try {
    const browser = await puppeteer.launch(browserOptions);
    let context = await browser.createIncognitoBrowserContext();
    let page = await context.newPage();

    await page.goto("http://localhost:1337", {
      waitUntil: "networkidle2",
      timeout: 5000,
    });

    await page.type("#note", "Flag: " + process.env.FLAG);
    await page.click("#create");

    await page.goto("http://localhost:1337/notes/" + noteId, {
      waitUntil: "networkidle0",
      timeout: 100000,
    });

    await page.waitForTimeout(10000);

    await browser.close();
  } catch (e) {
    console.log(e);
  }
};
