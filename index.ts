import { Application, Router, Context, helpers } from 'https://deno.land/x/oak/mod.ts'
import createCss from './createCss.ts'
import { IStickerOutPut, usefulObj } from './interfaces/json5.ts'
const decoder = new TextDecoder('utf-8')

interface ContextParams extends Context {
	params: usefulObj
}
//usefulObj、最低愛悪の型命名

const router = new Router()
router
	.get('/json', async (context: Context) => {
		const data = decoder.decode(await Deno.readFile(`./output/data.json`))
		const obj = JSON.parse(data)
		context.response.body = obj
	})
	.get('/:type', async (context: ContextParams) => {
		const type = context.params.type as 'mastodon'
		context.response.headers.set('Content-Type', `text/css`)
		const data = decoder.decode(await Deno.readFile(`./output/data.json`))
		const obj = JSON.parse(data)
		context.response.body = createCss(obj, type)
	})
	.get('/:type/peers', async (context: ContextParams) => {
		const type = context.params.type as 'mastodon'
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
		const data = decoder.decode(await Deno.readFile(`./output/data.json`))
		let obj = JSON.parse(data)
		let filtered = obj.data.filter(function (item: IStickerOutPut, index: number) {
			if (json.indexOf(item.domain) >= 0) return true
		})
		obj.data = filtered
		context.response.body = createCss(obj, type)
	})
	.get('/a/:static', async (context: ContextParams) => {
		const png = context.params.static
		console.log(png)
		context.response.headers.set('Content-Type', `image/png`)
		context.response.body = await Deno.readFile(`./static/${png}.png`)
	})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8000 })
