const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Overrides the default Chrome download path (~/.cache/puppeteer)
  // Forces Puppeteer to install and look for the browser inside the project folder
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};