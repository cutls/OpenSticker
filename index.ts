import { Application, Router, Context } from 'https://deno.land/x/oak/mod.ts'
import createCss from './createCss.ts'
const decoder = new TextDecoder('utf-8')

const router = new Router()
router
	.get('/css', async (context: Context) => {
		const data = decoder.decode(await Deno.readFile(`./output/data.json`))
		const obj = JSON.parse(data)
		context.response.body = createCss(obj)
	})
	.get('/json', async (context: Context) => {
		const data = decoder.decode(await Deno.readFile(`./output/data.json`))
		const obj = JSON.parse(data)
		context.response.body = obj
	})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8000 })
