import JSON5 from 'https://cdn.jsdelivr.net/gh/cutls/json5-deno@0.0.1/lib/index.ts'
import { ISticker } from './interfaces/json5.ts'
import { walkSync, existsSync, writeJsonSync, ensureDirSync } from 'https://deno.land/std/fs/mod.ts'
const decoder = new TextDecoder('utf-8')
/*
チェック
・ドメイン名のバリデーション
*/
let write = []
for (const entry of walkSync('./resources')) {
	if (!entry.isDirectory) continue
	const domain = entry.name
	if (domain == 'resources') continue
	if (domain.match(/[/\\]|\s/)) continue
	const read = decoder.decode(await Deno.readFile(`./resources/${domain}/data.json5`))
	let obj = JSON5.parse(read) as ISticker
	obj.domain = domain
	if (!obj.favicon) {
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
	} else {
        if(obj.favicon.substr(0,8) != 'https://') continue
		//どこかに画像を置いてもらうことになるよな…
		const url = `https://c.0px.io/${obj.favicon.replace('https://','')}`
		obj.favicon = url
	}
	write.push(obj)
}
ensureDirSync('./output')
writeJsonSync('./output/data.json', write)
