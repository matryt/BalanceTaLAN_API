import {TicketDTO} from "../types/TicketDTO";
import { Response } from 'express';
import {Prisma, PrismaClient} from "../generated/prisma";
import {ResultStatus} from "../types/ResultStatus";

const prisma = new PrismaClient();

export async function getTickets(): Promise<TicketDTO[]> {
	try {
		const tickets = await prisma.problem.findMany({
			include: {
				Person: true,
				ProblemCategory: true,
				Place: {
					include: {
						Area: true
					}
				},
				Message: true
			}
		});

		return tickets.map(ticket => transformTicket(ticket));
	} catch (err) {
		console.error(err);
		return [];
	}
}

export async function addTicket(firstname: string, lastname: string, placeAndArea: string,
								category: string, photos: Buffer[], title: string, description: string): Promise<ResultStatus> {
	return prisma.$transaction(async (tx) => {
		const [person, place, categoryEntity] = await Promise.all([
			tx.person.findFirst({
				where: {firstName: firstname, lastName: lastname}
			}),
			tx.place.findFirst({
				where: {
					number: parseInt(placeAndArea.split(" ")[1]),
					Area: {
						letter: placeAndArea.split(" ")[0]
					}
				}
			}),
			tx.problemCategory.findFirst({
				where: {name: category}
			})
		]);

		if (!person || !place || !categoryEntity) {
			return ResultStatus.INVALID_REQUEST;
		}

		const newTicket = await tx.problem.create({
			data: {
				title: title,
				Person: {
					connect: {
						id: person.id
					}
				},
				Place: {
					connect: {
						id: place.id
					}
				},
				ProblemCategory: {
					connect: {
						id: categoryEntity.id
					}
				}
			}
		});

		const newMessage = await tx.message.create({
			data: {
				problemId: newTicket.id,
				personId: person.id,
				content: description,
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

		if (!newMessage) {
			return ResultStatus.INTERNAL_ERROR
		}

		return ResultStatus.OK;
	});
}

export async function getTicket(ticketId: number) {
	try {
		const ticket = await prisma.problem.findFirst({
			where: {
				id: ticketId
			},
			include: {
				Person: true,
				ProblemCategory: true,
				Place: {
					include: {
						Area: true
					}
				},
				Message: true
				}
		});



		return ticket ? transformTicket(ticket) : false;
	} catch (err) {
		console.error(err);
		return false;
	}
}

function transformTicket(ticket: Prisma.ProblemGetPayload<{include: {Person: true; ProblemCategory: true;
		Place: { include: { Area: true } }; Message: true; }; }>): TicketDTO {
	return {
		id: ticket.id,
		firstName: ticket.Person?.firstName || "",
		lastName: ticket.Person?.lastName || "",
		place: `${ticket.Place?.Area?.letter} ${ticket.Place?.number}`,
		category: ticket.ProblemCategory?.name || "",
		title: ticket.title || "",
		messages: ticket.Message.map(message => {
			return {
				id: message.id,
			};
		})
	}
}