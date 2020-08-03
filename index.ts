import { Application, Router, Context, helpers } from 'https://deno.land/x/oak/mod.ts'
import JSON5 from 'https://cdn.jsdelivr.net/gh/cutls/json5-deno@0.0.1/lib/index.ts'
import createCss from './createCss.ts'
import { IStickerOutPut, usefulObj, dataJson } from './interfaces/json5.ts'
import { Config } from './interfaces/config.ts'
import builder from './builder.ts'
import { readJsonSync } from 'https://deno.land/std/fs/mod.ts'
const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec))

const decoder = new TextDecoder('utf-8')
let config = {secret: ''}
try {
	config = JSON5.parse(decoder.decode(await Deno.readFile(`./config.json5`))) as Config
} catch {}

interface ContextParams extends Context {
	params: usefulObj
}
//usefulObj、最低愛悪の型命名

const router = new Router()
router
	.get('/json', async (context: Context) => {
		context.response.headers.set('Access-Control-Allow-Origin', '*')
		context.response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		const obj = readJsonSync(`./output/data.json`) as dataJson
		context.response.body = obj
	})
	.get('/:type', async (context: ContextParams) => {
		const type = context.params.type as 'mastodon'
		context.response.headers.set('Access-Control-Allow-Origin', '*')
		context.response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		context.response.headers.set('Content-Type', `text/css`)
		const obj = readJsonSync(`./output/data.json`) as dataJson
		context.response.body = createCss(obj, type)
	})
	.get('/:type/peers', async (context: ContextParams) => {
		const type = context.params.type as 'mastodon'
		context.response.headers.set('Access-Control-Allow-Origin', '*')
		context.response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		let domain
		let json: string[]
		try {
			domain = helpers.getQuery(context).domain
			const promise = await fetch(`https://${domain}/api/v1/instance/peers`)
			json = await promise.json()
		} catch {
			context.response.body = { success: false }
			return
		}
		context.response.headers.set('Content-Type', `text/css`)
		const obj = readJsonSync(`./output/data.json`) as dataJson
		let filtered = obj.data.filter(function (item: IStickerOutPut, index: number) {
			if (json.indexOf(item.domain) >= 0) return true
		})
		obj.data = filtered
		context.response.body = createCss(obj, type)
	})
	.get('/a/:static', async (context: ContextParams) => {
		context.response.headers.set('Access-Control-Allow-Origin', '*')
		context.response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		const png = context.params.static
		context.response.headers.set('Content-Type', `image/png`)
		context.response.body = await Deno.readFile(`./static/${png}.png`)
	})
	.get('/c/:static', async (context: ContextParams) => {
		context.response.headers.set('Access-Control-Allow-Origin', '*')
		context.response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		const png = decodeURIComponent(context.params.static)
		const promise = await fetch(`https://images.weserv.nl/?output=png&w=25&url=${png}`)
		context.response.headers.set('Content-Type', `image/png`)
		context.response.body = await promise.text()
	})
	.post('/webhook/:secret', async (context: ContextParams) => {
		const secret = context.params.secret
		if(secret != config.secret) {
			context.response.body = { success: false }
			return
		}
		await sleep(1000)
		builder()
		context.response.body = { success: true }
	})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8000 })
