import authController from 'controllers/auth.controller.js'
import { Router } from 'express'
import { RequestJwtValidator } from 'utility/hash/jwtValidate.js'

const router: any = Router()

router.post('/user', authController.login)

router.put('/user',RequestJwtValidator ,authController.updateUser)

router.delete('/user',RequestJwtValidator ,authController.deleteUser)

router.get('/user', authController.getUsers)

export default router