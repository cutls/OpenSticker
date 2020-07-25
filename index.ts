import { Application, Router, Context } from 'https://deno.land/x/oak/mod.ts'

const router = new Router()
router
	.get('/', (context: Context) => {
		context.response.body = 'Hello world!'
	})
	.get('/book', (context: Context) => {
	})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8000 })
