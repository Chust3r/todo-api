import { t } from 'elysia'

export const cookie = t.Cookie({
	auth: t.Object({
		token: t.String(),
		refresh: t.String(),
	}),
})
