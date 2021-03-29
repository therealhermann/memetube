/**
 * Description. Custom logger with file transports and console transports
 *              depending on the level.
 * 
 * Levels: 
 * 
 *  info: Generally useful information to log, metrics
 *  warn: Anything that can potentially cause application oddities, but for which I am automatically recovering
 *  error: Any error which is fatal to the operation
 * 
 * @author Jarry Ngandjui
 * @since 10.23.2020
 */

'use strict';

const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, label, printf, align } = format;
const { SPLAT } = require('triple-beam');
const { isObject } = require('lodash');

function createFileTransport() {
  /**
   * Description. All log for the same day are saved in the same file. Creates
   *              a log file for the day is it does not exist.
   *
   */
  var now = new Date();
  var prefix = process.cwd() + '/tools/puppeteer/src/logs/';
  var day = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}.log`;
  var filename = prefix + day;
  var defaultFilename = prefix + 'default.log';

  try {
    if (!fs.existsSync(filename)) {
      fs.writeFile(filename, '', (err) => {
        if (err) throw err;
      });
    }
    return filename;
  } catch (e) {
    return defaultFilename;
  }
};

function formatObject(param) {
  /**
   * Description. Object represenation in logger.
   */
  if (isObject(param)) {
    return JSON.stringify(param);
  }
  return param;
}

// Ignore log messages if they have { private: true }
const all = format((info) => {
  /**
   * Description. Enable multiple paramers to the winston logger.
   */
  const splat = info[SPLAT] || [];
  const message = formatObject(info.message);
  const rest = splat.map(formatObject).join(' ');
  info.message = `${message} ${rest}`;
  return info;
});

const logger = createLogger({
  format: combine(
    all(),
    label({ label: 'dev' }),
    timestamp(),
    align(),
    printf(
      (info) =>
      `${info.timestamp} [${info.label}] ${info.level}: ${formatObject(
          info.message
        )}`
    )
  ),
  transports: [
    new transports.Console()
  ],
});

module.exports = logger;