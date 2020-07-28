import JSON5 from 'https://cdn.jsdelivr.net/gh/cutls/json5-deno@0.0.1/lib/index.ts'
import { IStickerOutPut } from './interfaces/json5.ts'
import { walkSync, readJsonSync, writeJsonSync, ensureDirSync, ensureFileSync } from 'https://deno.land/std/fs/mod.ts'
const decoder = new TextDecoder('utf-8')
/*
チェック
・ドメイン名のバリデーション
*/
let writeCache: { [key: string]: string } = {}
let write = []
ensureFileSync('./output/cache.json')
let cache = null
try {
	cache = readJsonSync('./output/cache.json') as null | { [key: string]: string }
} catch {}

for (const entry of walkSync('./resources')) {
	if (!entry.isDirectory) continue
	const domain = entry.name
	const camelCase = camelize(domain)
	if (domain == 'resources') continue
	if (domain.match(/[/\\]|\s/)) continue
	const read = decoder.decode(await Deno.readFile(`./resources/${domain}/data.json5`))
	let obj = JSON5.parse(read) as IStickerOutPut
	obj.domain = domain
	if (!obj.name) obj.name = domain
	if (!obj.favicon) {
		if (!cache || !cache[domain]) {
			const url = `https://fedicon.0px.io/get/${domain}`
			const promise = await fetch(url)
			const json = await promise.json()
			if (!json.success) continue
			let favicon
			const type = json.type
			let assets
			if (type == 'mastodon') assets = 'md'
			if (type == 'pleroma') assets = 'pl'
			if (type == 'misskey') assets = 'mi'
			if (type == 'misskeyv11') assets = 'ml'
			if (type == 'pixelfed') assets = 'pf'
			if (!json.isDefault) favicon = json.url
			if (json.isDefault) favicon = `https://a.0px.io/${assets}.png`
			obj.favicon = favicon
			writeCache[domain] = favicon
		} else {
			obj.favicon = cache[domain]
			writeCache[domain] = cache[domain]
		}
	} else {
		if (obj.favicon.substr(0, 8) != 'https://') continue
		//どこかに画像を置いてもらうことになるよな…
		const url = `https://c.0px.io/${obj.favicon.replace('https://', '')}`
		obj.favicon = url
	}
	write.push(obj)
}
ensureDirSync('./output')
const output = {
	data: write,
	updated: new Date().toString()
}
writeJsonSync('./output/data.json', output)
writeJsonSync('./output/cache.json', writeCache)

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
