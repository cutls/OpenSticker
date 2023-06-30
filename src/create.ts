import { IDetector, ISticker, IStickerOutPut } from '../interfaces/json5'
import JSON5 from 'json5'
import fs from 'fs'
import { createCss } from './createCss'
import { detector } from './detector'
const alphabets = [
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'0',
]
const def = {
	mastodon: {
		bgColor: ['#26a'],
		fontColor: '#fff',
	},
	pleroma: {
		bgColor: ['#123'],
		fontColor: '#da5',
	},
	misskey: {
		bgColor: ['#444'],
		fontColor: '#3c9',
	},
	misskeylegacy: {
		bgColor: ['#444'],
		fontColor: '#3c9',
	},
	pixelfed: {
		bgColor: ['#fff'],
		fontColor: '#000',
	},
}
/*
チェック
・ドメイン名のバリデーション
*/
export default async function main() {
	let writeCache: { [key: string]: string } = {}
	let write = []
	const cacheRaw = fs.readFileSync('./output/cache.json').toString()
	const cache = JSON.parse(cacheRaw)
	try {
		for (const alphabet of alphabets) {
			if (!fs.existsSync(`./resources/${alphabet}`)) continue
			const dirs = fs.readdirSync(`./resources/${alphabet}`)
			for (const domain of dirs) {
				if (!fs.statSync(`./resources/${alphabet}/${domain}`).isDirectory()) continue
				const camelCase = camelize(domain)
				if (domain == 'resources') continue
				if (domain.match(/[/\\]|\s/)) continue
				const read = fs.readFileSync(`./resources/${alphabet}/${domain}/data.json5`).toString()
				let obj: ISticker = JSON5.parse(read)
				let newObj: any = {}
				newObj.domain = domain
				obj.name ? (newObj.name = obj.name) : (newObj.name = domain)
				if (obj.bgColor) newObj.bgColor = obj.bgColor
				if (obj.fontColor) newObj.fontColor = obj.fontColor
				newObj.type = obj.type
				if (!obj.favicon) {
					if (!cache || !cache[domain]) {
						console.log('no cache:' + domain)
						let json: IDetector
						try {
							json = await detector(null, domain)
						} catch {
							continue
						}
						if (!json.success) continue
						let favicon: string = ''
						const type = json.type
						let assets
						if (type == 'mastodon') assets = 'md'
						if (type == 'pleroma') assets = 'pl'
						if (type == 'misskey') assets = 'mi'
						if (type == 'misskeylegacy') assets = 'ml'
						if (type == 'pixelfed') assets = 'pf'
						if (!json.isDefault) {
							favicon = `https://images.weserv.nl/?url=${encodeURI(json.url)}&output=png&w=15`
						} else {
							favicon = `https://s.0px.io/a/${assets}.png`
						}
						let rawFavicon = favicon
						newObj.withoutCDN = rawFavicon
						if (!json.isDefault) rawFavicon = json.url
						newObj.isDefault = false
						if (json.isDefault && !obj.bgColor && !obj.fontColor) newObj.isDefault = true
						newObj.favicon = favicon
						writeCache[domain] = rawFavicon
					} else {
						newObj.withoutCDN = cache[domain]
						if (obj.favicon) newObj.favicon = obj.favicon
						newObj.isDefault = false
						if (!obj.favicon) {
							if (~cache[domain].indexOf('https://s.0px.io/a/')) {
								newObj.isDefault = true
								newObj.favicon = cache[domain]
							} else {
								newObj.favicon = `https://images.weserv.nl/?url=${encodeURI(cache[domain])}&output=png&w=15`
							}
						}
						writeCache[domain] = cache[domain]
					}
				} else {
					//どこかに画像を置いてもらうことになるよな…
					newObj.favicon = `https://images.weserv.nl/?url=${encodeURI(obj.favicon)}&output=png&w=15`
					newObj.withoutCDN = obj.favicon
				}
				write.push(newObj)
			}
		}
		const output = {
			data: write,
			updated: new Date().toString(),
			default: def,
		}
		fs.writeFileSync('./output/data.json', JSON.stringify(output))
		fs.writeFileSync('./output/cache.json', JSON.stringify(writeCache))
		createCss(output, 'mastodon')
	} catch (e) {
		console.error(e)
		fs.writeFileSync('./output/cache.json', JSON.stringify(writeCache))
	}
}
main()

function camelize(str: string) {
	let arr = str.split('.')
	let output = ''
	for (let i = 0; i < arr.length; i++) {
		let target = arr[i]
		if (i > 0) {
			output = output + target.substr(0, 1).toUpperCase() + target.substr(1)
		}
		if (i === 0) output = target
	}
	return output
}
