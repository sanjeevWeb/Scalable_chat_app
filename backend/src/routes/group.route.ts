import groupController from 'controllers/group.controller.js'
import { Router } from 'express'
import { RequestJwtValidator } from 'utility/hash/jwtValidate.js'

const router: any = Router()


router.post('/group', RequestJwtValidator, groupController.createGroup)

router.put('/group', RequestJwtValidator, groupController.updateGroup)

router.delete('/group', RequestJwtValidator, groupController.deleteGroup)

router.get('/group/list', RequestJwtValidator, groupController.getUserChatsLists)

export default router