console.log('sdd')
import puppeteer from 'puppeteer'
import path from 'node:path'

async function downloadProtected(websiteUrl, fileUrl, outDir = './downloads') {
	const browser = await puppeteer.launch({ headless: 'new' })
	const page = await browser.newPage()
	const client = await page.target().createCDPSession()
	await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' })

	await client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: path.resolve(outDir),
	})

	await new Promise(async (resolve, reject) => {
		let started = false
		let lastInterval = null

		client.on('Page.downloadProgress', (e) => {
			started = true

			clearInterval(lastInterval)

			lastInterval = setInterval(
				(lastUpdateTime) => {
					console.log(lastUpdateTime)
					let currentTime = Math.floor(new Date().getTime() / 1000)

					if (currentTime - lastUpdateTime >= 30) {
						reject('Download timeout')
					}
				},
				1000,
				Math.floor(new Date().getTime() / 1000)
			)

			if (e.state === 'completed') {
				clearInterval(lastTimeout)
				resolve()
			}
		})

		await page.evaluate((link) => {
			const a = document.createElement('a')
			a.style.display = 'none'
			document.body.appendChild(a)
			a.setAttribute('href', link)
			a.click()
			document.body.removeChild(a)
		}, fileUrl)

		await new Promise((resolve) => setTimeout(resolve, 5000))
		if (!started) {
			reject('No hubo nada para descargar')
		}
	})
}

const websiteUrl =
	'https://ichvirtual.edu.pe/ich-intranetalumnos/public/index.php'
const fileUrl =
	'https://ichintranetalumnos.s3.us-east-1.amazonaws.com/materiales_extras/filemd8675-2023-07-17%2010-44-35.pdf'

downloadProtected(websiteUrl, fileUrl, './downloads')
	.then(() => console.log('Descarga del PDF completada.'))
	.catch((err) => console.error('Error al descargar el PDF:', err))

//downloadProtected()

const pageInit = async function init(websiteUrl) {}

class Downloader {
	constructor(websiteUrl) {
		this.navigator = null
		this.websiteUrl = websiteUrl
	}

	async start() {
		const browser = await puppeteer.launch({ headless: 'new' })
		const page = await browser.newPage()
		const client = await page.target().createCDPSession()
		await page.goto(this.websiteUrl, { waitUntil: 'domcontentloaded' })
		this.navigator = { browser, page, client }
	}

	async download(fileUrl, outDir = './downloads') {
		if (!this.navigator) {
			throw new Error('Downloader not started')
		}

		const { page, client } = this.navigator

		await client.send('Page.setDownloadBehavior', {
			behavior: 'allow',
			downloadPath: path.resolve(outDir),
		})

		let downloading = false
		let lastInterval = null

		client.on('Page.downloadProgress', (e) => {
			downloading = true

			clearInterval(lastInterval)
			const time = Math.floor(new Date().getTime() / 1000)

			lastInterval = setInterval(
				(lastUpdateTime) => {
					let currentTime = Math.floor(new Date().getTime() / 1000)

					if (currentTime - lastUpdateTime >= 10) {
						reject('Download timeout')
					}
				},
				1000,
				time
			)

			if (e.state === 'completed') {
				client.removeAllListeners()
				clearInterval(lastTimeout)
				resolve()
			}
		})

		await page.evaluate((link) => {
			const a = document.createElement('a')
			a.style.display = 'none'
			document.body.appendChild(a)
			a.setAttribute('href', link)
			a.click()
			document.body.removeChild(a)
		}, fileUrl)

		await new Promise((resolve) => setTimeout(resolve, 5000))
		if (!downloading) {
			client.removeAllListeners()
			reject('There was nothing to download')
		}
	}
}
