import messageController from 'controllers/message.controller.js'
import { Router } from 'express'
import { RequestJwtValidator } from 'utility/hash/jwtValidate.js'

const router: any = Router()

router.post('/message/chitchat', RequestJwtValidator, messageController.saveChitchatMsg)

router.post('/message/group', RequestJwtValidator, messageController.saveGroupMsg)

router.put('/message/chitchat', RequestJwtValidator, messageController.updateChitchatMsg)

router.put('/message/group', RequestJwtValidator, messageController.updateGroupMsg)

router.delete('/message/chitchat', RequestJwtValidator, messageController.deleteChitchatMsg)

router.delete('/message/group', RequestJwtValidator, messageController.deleteGroupMsg)

router.get('/message/chitchat', RequestJwtValidator, messageController.getMessegesOfChitchat)

router.get('/message/group', RequestJwtValidator, messageController.getMessegesOfGroup)

export default router