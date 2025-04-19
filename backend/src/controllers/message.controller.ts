import { NextFunction, Request, Response } from "express";
import { API_RESPONSE_MESSAGE, ERROR_MESSAGE } from "utility/constants/constant.js";
import HTTP_STATUS_CODE from "utility/constants/httpStatusCode.js";
import prisma from "utility/database/db.js";
import { ChitchatMsg } from "./interface.js";


class MessageController {
    async saveChitchatMsg(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { message, receiverId } = req.body
            const msg: ChitchatMsg = await prisma.chitchat_msg.create({
                data: { message, senderId: user_id, receiverId }
            })
            return res.status(HTTP_STATUS_CODE.CREATED).send(msg);
        }
        catch (error: any) {
            if (error.code === "P2002") {
                return res.status(422).send({ error: "Group already exists (Unique constraint failed)" });
            }

            console.error("Error creating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async saveGroupMsg(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { message, groupId } = req.body
            const msg = await prisma.group_msg.create({
                data: { message, senderId: user_id, groupId }
            })
            return res.status(HTTP_STATUS_CODE.CREATED).send(msg);
        }
        catch (error: any) {
            if (error.code === "P2002") {
                return res.status(422).send({ error: "Group already exists (Unique constraint failed)" });
            }

            console.error("Error creating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async updateChitchatMsg(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { newMessage, chitchatId } = req.body
            const existingMsg = await prisma.chitchat_msg.findUnique({
                where: { chitchatId },
                select: { senderId: true }
            });

            if (!existingMsg) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ error: "Message not found" });
            }

            if (existingMsg.senderId !== user_id) {
                return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ error: "Unauthorized to update this message" });
            }
            const updatedMsg = await prisma.chitchat_msg.update({
                where: { chitchatId },
                data: { message: newMessage }
            });
            return res.status(HTTP_STATUS_CODE.OK).send(updatedMsg);
        }
        catch (error: any) {
            // if (error.code === "P2002") {
            //     return res.status(422).send({ error: "Group already exists (Unique constraint failed)" });
            // }

            console.error("Error creating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async updateGroupMsg(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { newMessage, groupMsgId } = req.body
            const existingMsg = await prisma.group_msg.findUnique({
                where: { groupMsgId },
                select: { senderId: true }
            });

            if (!existingMsg) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ error: "Message not found" });
            }

            if (existingMsg.senderId !== user_id) {
                return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ error: "Unauthorized to update this message" });
            }
            const msg = await prisma.group_msg.update({
                where: { groupMsgId },
                data: { message: newMessage }
            })
            return res.status(HTTP_STATUS_CODE.OK).send(msg);
        }
        catch (error: any) {
            // if (error.code === "P2002") {
            //     return res.status(422).send({ error: "" });
            // }

            console.error("Error creating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async deleteChitchatMsg(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { chitchatId } = req.query

            const existingMsg = await prisma.group_msg.findUnique({
                where: { chitchatId },
                select: { senderId: true }
            });

            if (!existingMsg) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ error: "Message not found" });
            }

            if (existingMsg.senderId !== user_id) {
                return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ error: "Unauthorized to update this message" });
            }
            await prisma.chitchat_msg.delete({
                where: { chitchatId }
            })
            return res.status(HTTP_STATUS_CODE.OK).send({ msg: 'msg deleted successfully' });
        }
        catch (error: any) {
            // if (error.code === "P2002") {
            //     return res.status(422).send({ error: "" });
            // }

            console.error("Error creating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async deleteGroupMsg(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { groupMsgId } = req.query

            const existingMsg = await prisma.group_msg.findUnique({
                where: { groupMsgId },
                select: { senderId: true }
            });

            if (!existingMsg) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ error: "Message not found" });
            }

            if (existingMsg.senderId !== user_id) {
                return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ error: "Unauthorized to update this message" });
            }
            await prisma.group_msg.delete({
                where: { groupMsgId }
            })
            return res.status(HTTP_STATUS_CODE.OK).send(API_RESPONSE_MESSAGE.SUCCESS);
        }
        catch (error: any) {
            // if (error.code === "P2002") {
            //     return res.status(422).send({ error: "" });
            // }

            console.error("Error creating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async getMessegesOfGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { groupId } = req.query

            const existingGrpMember = await prisma.group_members.findUnique({
                where: { groupId },
                select: { memberId: true }
            })

            if (existingGrpMember.memberId !== user_id) {
                return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send(ERROR_MESSAGE.UNAUTHORIZED);
            }

            const messages: Array<{}> = await prisma.group_msg.findMany({ where: { groupId } })
            return res.status(HTTP_STATUS_CODE.OK).send(messages);
        }
        catch (error: any) {
            console.error("Error creating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async getMessegesOfChitchat(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { chitchatId } = req.query

            const existingMsg: { senderId: number, receiverId: number } = await prisma.chitchat_msg.findUnique({
                where: { chitchatId },
                select: {
                    senderId: true,
                    receiverId: true
                }
            })

            if (existingMsg.senderId !== user_id || existingMsg.receiverId !== user_id) {
                return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send(ERROR_MESSAGE.UNAUTHORIZED);
            }

            const messages: ChitchatMsg[] = await prisma.chitchat_msg.findMany({
                where: { chitchatId }
            })
            return res.status(HTTP_STATUS_CODE.OK).send(messages);
        }
        catch (error: any) {
            
            console.error("Error creating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

}

export default new MessageController()