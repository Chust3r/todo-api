import Elysia from 'elysia'

// → Auth Services

import { email } from './email'
import { login } from './login'
import { logout } from './logout'
import { password } from './password'
import { register } from './register'
import { user } from './user'

export const authController = new Elysia().group('/auth', (app) => {
	return app
		.use(email)
		.use(login)
		.use(logout)
		.use(password)
		.use(register)
		.use(user)
})
