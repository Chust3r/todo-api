import { jwt as JWT } from '@elysiajs/jwt'

export const jwt = JWT({
	name: 'jwt',
	secret: 'SECRET',
	exp: '60m',
})

export const refresh = JWT({
	name: 'refresh',
	secret: 'SECRET',
	exp: '90m',
})
