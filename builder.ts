import JSON5 from 'https://cdn.jsdelivr.net/gh/cutls/json5-deno@0.0.1/lib/index.ts'
import { ISticker } from './interfaces/json5.ts'
import { walkSync, existsSync, writeJsonSync, ensureDirSync } from 'https://deno.land/std/fs/mod.ts'
import { download, Destination } from 'https://deno.land/x/download/mod.ts'
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
	if (!obj.favicon && !existsSync(`./resources/${domain}/favicon.webp`)) {
		let file
		if (obj.type == 'mastodon') file = 'favicon.ico'
		if (obj.type == 'pleroma') file = 'favicon.png'
		if (obj.type == 'misskey') file = 'favicon.ico'
		if (obj.type == 'pixelfed') file = 'img/favicon.png'
		//webp変換もサイズ変換もDenoでやりたいけど、今のライブラリ量じゃ無理
        const url = `https://images.weserv.nl/?url=${domain}/${file}&w=20&output=webp`
        obj.favicon = url
	} else if(!existsSync(`./resources/${domain}/favicon.webp`)) {
		//どこかに画像を置いてもらうことになるよな…
		const url = `https://images.weserv.nl/?url=${obj.favicon}&w=20&output=webp`
		obj.favicon = url
	}
	write.push(obj)
}
ensureDirSync("./output")
writeJsonSync('./output/data.json', write)