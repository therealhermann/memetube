'use strict';

const app = require('./lib/app')
const host = '0.0.0.0';
const port = 4000;

var minutes = 5;
var instance = app.listen(port, host, () => {
	console.log(`[MT-Puppeteer API] - Server running... on port ${port} with timeout ${app.timeout}`);
});

/**
 * Modify instance.timeout to extend request durations.
 */
instance.timeout = minutes * 60 * 1000;
console.log(`Instance Timeout: ${instance.timeout}`)