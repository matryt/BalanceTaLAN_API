import {Response} from "express";
import {PrismaClient} from "../generated/prisma";
import {ResultStatus} from "../types/ResultStatus";

const prisma = new PrismaClient();

export async function getPhoto(messageId: number, photoId: number, res: Response) {
	try {
		const photo = await prisma.photos.findFirst({
			where: {
				imageNumber: photoId,
				messageId: messageId
			},
			select: {
				content: true
			}
		});

		if (!photo || !photo.content) {
			return false;
		}

		return Buffer.from(photo.content);
	} catch (err) {
		console.error(err);
		return false;
	}
}

export async function getMessage(messageId: number) {
	try {
		const message = await prisma.message.findUnique({
			where: {
				id: messageId
			},
			include: {
				Photos: true
			}
		});
		if (!message) {
			return false;
		}
		const messageData = {
			content: message.content || "",
			id: messageId,
			photos: message.Photos.map((photo) => {
				return {
					photoNumber: photo.id,
					url: '/messages/' + messageId + '/photos/' + photo.imageNumber,
				};
			})
		}
		return messageData;
	} catch (err) {
		console.error(err);
		return false;
	}
}

export async function addMessage(ticketId: number, content: string, firstName: string, lastName: string, photos: Buffer[]) {
	try {
		const person = await prisma.person.findFirst({
			where: {
				firstName: firstName,
				lastName: lastName
			}
		});

		if (!person) {
			return ResultStatus.INVALID_REQUEST;
		}

		const ticket = await prisma.problem.findFirst({
			where: {
				id: ticketId
			}
		});

		if (!ticket) {
			return ResultStatus.INVALID_REQUEST;
		}

		const message = await prisma.message.create({
			data: {
				problemId: ticketId,
				content: content,
				personId: person.id,
				Photos: {
					createMany: {
						data: photos.map((photo, index) => ({
							content: photo,
							imageNumber: index
						}))
					}
				}
			}
		});
		if (!message) {
			return ResultStatus.INTERNAL_ERROR;
		}
		return ResultStatus.OK;
	} catch (err) {
		console.error(err);
		return false;
	}
}