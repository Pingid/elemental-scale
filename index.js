const puppeteer = require('puppeteer');

const renderInterface = require('./dom/renderInterface.js')
const waitForSubmit = require('./dom/waitForSubmit.js')

const createPDF = require('./printing/createPDF')
const print = require('./printing/print')

const run = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const weight = await page.evaluate(renderInterface);

  const name = '/output.pdf';

  const makePrint = async () => {
    const weight = await page.evaluate(waitForSubmit)

    const buffer = await createPDF(weight, name);
    await print(buffer)

    return makePrint();
  }

  await makePrint();
}

run();
