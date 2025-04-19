import { NextFunction, Request, Response } from "express";
import { API_RESPONSE_MESSAGE, ERROR_MESSAGE } from "utility/constants/constant.js";
import HTTP_STATUS_CODE from "utility/constants/httpStatusCode.js";
import { GroupInterface } from "./interface.js";
import prisma from "utility/database/db.js";


class Group {
    async createGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id, email } = req.user;

            // Check if the group already exists ,if it is returns null but if fails(db or n/w err), thrws exceptions
            const groupExisted = await prisma.group.findUnique({
                where: { groupName: req.body.groupName },
            });

            if (!groupExisted) {
                // Create new group
                const group: GroupInterface = await prisma.group.create({
                    data: {
                        groupName: req.body.groupName,
                        adminId: user_id
                    },
                });

                return res.status(HTTP_STATUS_CODE.CREATED).send(group);
            }

            return res.status(HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY).send({ error: "Group already exists" });
        }
        catch (error: any) {
            if (error.code === "P2002") {
                return res.status(422).send({ error: "Group already exists (Unique constraint failed)" });
            }

            console.error("Error creating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async updateGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { groupId, newGroupName } = req.body // not able to acccess variables this way if apply types 

            const findGrp: any = await prisma.group.findUnique({
                where: { groupId: req.body.groupId }
            })

            if (findGrp && findGrp.adminId === user_id) {
                await prisma.group.update({
                    where: { groupId: req.body.groupId },
                    data: {
                        // groupName: req.body.newGroupName,
                        groupName: newGroupName,
                    },
                })
                return res.status(HTTP_STATUS_CODE.OK).send(API_RESPONSE_MESSAGE.SUCCESS)
            }
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ msg: "No such group or not authorized" })
        }
        catch (error: any) {
            // if (error.code === "P2002") {
            //     return res.status(422).send({ error: "Group already exists (Unique constraint failed)" });
            // }

            console.error("Error updating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async deleteGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user
            const { groupId } = req.query

            const findGrp: any = await prisma.group.findUnique({
                where: { groupId }
            })

            if (!findGrp) return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ msg: 'No such group exist' })
            if (findGrp.adminId !== user_id) {
                return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send(ERROR_MESSAGE.UNAUTHORIZED)
            }
            await prisma.group.delete({
                where: {
                    groupId,
                },
            })

            return res.status(HTTP_STATUS_CODE.OK).send({ msg: 'Group deleted sucessfully' })
        }
        catch (error: any) {
            // if (error.code === "P2002") {
            //     return res.status(422).send({ error: "Group already exists (Unique constraint failed)" });
            // }

            console.error("Error updating group:", error);
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER)
        }
    }

    async getUserChatsLists(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.user; // Extract user_id from JWT (Assuming you have authentication middleware)

            // Fetch groups where user is an admin or a member
            const groups = await prisma.group.findMany({
                where: {
                    OR: [
                        { adminId: user_id }, // Groups created by user
                        { groupMembers: { some: { memberId: user_id } } } // Groups where user is a member
                    ]
                },
                select: {
                    groupId: true,
                    groupName: true
                }
            });

            // Fetch distinct one-on-one chat users (either sender or receiver)
            const oneOnOneChats = await prisma.chitchat_msg.findMany({
                where: {
                    OR: [{ senderId: user_id }, { receiverId: user_id }]
                },
                select: {
                    sender: { select: { userId: true, username: true } },
                    receiver: { select: { userId: true, username: true } }
                },
                distinct: ["senderId", "receiverId"] // Avoid duplicate chats
            });

            // Extract unique chat usernames
            const chatUsers = new Map();
            oneOnOneChats.forEach(({ sender, receiver }: any) => {
                if (sender.userId !== user_id) chatUsers.set(sender.userId, sender.username);
                if (receiver.userId !== user_id) chatUsers.set(receiver.userId, receiver.username);
            });

            return res.status(200).json({
                groups,
                oneOnOneChats: Array.from(chatUsers, ([userId, username]) => ({ userId, username }))
            });
        } catch (error) {
            console.error("Error fetching user chats:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default new Group()