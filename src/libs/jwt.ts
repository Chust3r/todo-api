import { jwt as JWT } from '@elysiajs/jwt'

const { EXP_JWT, EXP_REFRESH } = Bun.env

export const jwt = JWT({
	name: 'jwt',
	secret: 'SECRET',
	exp: EXP_JWT,
})

export const refresh = JWT({
	name: 'refresh',
	secret: 'SECRET',
	exp: EXP_REFRESH,
})
