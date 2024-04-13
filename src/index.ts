import { Elysia } from 'elysia'

import { controllers } from '@controllers'

const app = new Elysia().use(controllers).listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
