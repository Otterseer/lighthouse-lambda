const chromium = require('chrome-aws-lambda')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher');

const defaultFlags = [
	'--autoplay-policy=user-gesture-required',
	'--disable-background-networking',
	'--disable-background-timer-throttling',
	'--disable-backgrounding-occluded-windows',
	'--disable-breakpad',
	'--disable-client-side-phishing-detection',
	'--disable-component-update',
	'--disable-default-apps',
	'--disable-dev-shm-usage',
	'--disable-domain-reliability',
	'--disable-extensions',
	'--disable-features=AudioServiceOutOfProcess',
	'--disable-hang-monitor',
	'--disable-ipc-flooding-protection',
	'--disable-notifications',
	'--disable-offer-store-unmasked-wallet-cards',
	'--disable-popup-blocking',
	'--disable-print-preview',
	'--disable-prompt-on-repost',
	'--disable-renderer-backgrounding',
	'--disable-setuid-sandbox',
	'--disable-speech-api',
	'--disable-sync',
	'--disk-cache-size=33554432',
	'--headless',
	'--hide-scrollbars',
	'--ignore-gpu-blacklist',
	'--metrics-recording-only',
	'--mute-audio',
	'--no-default-browser-check',
	'--no-first-run',
	'--no-pings',
	'--no-sandbox',
	'--no-zygote',
	'--password-store=basic',
	'--use-gl=swiftshader',
	'--use-mock-keychain',
]


if (['AWS_Lambda_nodejs10.x', 'AWS_Lambda_nodejs12.x', 'AWS_Lambda_nodejs14.x'].includes(process.env.AWS_EXECUTION_ENV) === true) {
	if (process.env.FONTCONFIG_PATH === undefined) {
		process.env.FONTCONFIG_PATH = '/tmp/aws';

	}

	if (process.env.LD_LIBRARY_PATH === undefined) {
		process.env.LD_LIBRARY_PATH = '/tmp/aws/lib';
	} else if (process.env.LD_LIBRARY_PATH.startsWith('/tmp/aws/lib') !== true) {
		process.env.LD_LIBRARY_PATH = [...new Set(['/tmp/aws/lib', ...process.env.LD_LIBRARY_PATH.split(':')])].join(':');
	}
}


module.exports = async function createLighthouse(url, options = {}, flags = []) {
	const log = options.logLevel ? require('lighthouse-logger') : null

	if (log)
		log.setLevel(options.logLevel)


	const browser = await chromeLauncher.launch({
		port: 9222,
		chromePath: await chromium.executablePath,
		chromeFlags: defaultFlags.concat(flags)
	});

	// Run lighthouse process
	const results = await lighthouse(url, options);

	return {
		browser,
		log,
		results
	}
}
