import JSON5 from 'https://cdn.jsdelivr.net/gh/cutls/json5-deno@0.0.1/lib/index.ts'
import { IStickerOutPut } from './interfaces/json5.ts'
import { walkSync, readJsonSync, writeJsonSync, ensureDirSync, ensureFileSync } from 'https://deno.land/std/fs/mod.ts'
const decoder = new TextDecoder('utf-8')
const alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0']
const def = {
	mastodon: {
		bgColor: ['#26a'],
		fontColor: '#fff'
	},
	pleroma: {
		bgColor: ['#123'],
		fontColor: '#da5'
	},
	misskey: {
		bgColor: ['#444'],
		fontColor: '#3c9'
	},
	misskeylegacy: {
		bgColor: ['#444'],
		fontColor: '#3c9'
	},
	pixelfed: {
		bgColor: ['#fff'],
		fontColor: '#000'
	}
}
/*
チェック
・ドメイン名のバリデーション
*/
export default function() {
	main()
}
async function main() {
	let writeCache: { [key: string]: string } = {}
	let write = []
	ensureFileSync('./output/cache.json')
	let cache = null
	try {
		cache = readJsonSync('./output/cache.json') as null | { [key: string]: string }
	} catch {}
	for (const alphabet of alphabets) {
		ensureDirSync(`./resources/${alphabet}`)
		for (const entry of walkSync(`./resources/${alphabet}`)) {
			if (!entry.isDirectory) continue
			const domain = entry.name
			const camelCase = camelize(domain)
			if (domain == 'resources') continue
			if (domain.match(/[/\\]|\s/)) continue
			let read
			try {
				read = decoder.decode(await Deno.readFile(`./resources/${alphabet}/${domain}/data.json5`))
			} catch {
				continue
			}
			let obj = JSON5.parse(read) as IStickerOutPut
			obj.domain = domain
			if (!obj.name) obj.name = domain
			if (!obj.favicon) {
				if (!cache || !cache[domain]) {
					console.log('no cache:' + domain)
					const url = `https://fedicon.0px.io/get/${domain}`
					const promise = await fetch(url)
					let json
					try {
						json = await promise.json()
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
					if (type == 'misskeyv11') assets = 'ml'
					if (type == 'pixelfed') assets = 'pf'
					if (!json.isDefault) favicon = `https://s.0px.io/c/${encodeURI(json.url.replace('https://', ''))}`
					if (json.isDefault) favicon = `https://s.0px.io/a/${assets}`
					obj.isDefault = false
					if(json.isDefault && !json.bgColor && !json.fontColor) obj.isDefault = true
					obj.favicon = favicon
					writeCache[domain] = favicon
				} else {
					obj.favicon = cache[domain]
					obj.isDefault = false
					if(~obj.favicon.indexOf('https://s.0px.io/a/') && !obj.bgColor && !obj.fontColor) obj.isDefault = true
					writeCache[domain] = cache[domain]
				}
			} else {
				//どこかに画像を置いてもらうことになるよな…
				const url = `https://c.0px.io/${encodeURI(obj.favicon.replace('https://', ''))}`
				obj.favicon = url
			}
			write.push(obj)
		}
	}
	
	ensureDirSync('./output')
	const output = {
		data: write,
		updated: new Date().toString(),
		default: def
	}
	writeJsonSync('./output/data.json', output)
	writeJsonSync('./output/cache.json', writeCache)
}

function camelize(str: string) {
	let arr = str.split('.')
	let output = ''
	for (let i = 0; i < arr.length; i++) {
		let target = arr[i]
		if (i > 0) output = output + target.substr(0, 1).toUpperCase() + target.substr(1)
		if (i === 0) output = target
	}
	return output
}
