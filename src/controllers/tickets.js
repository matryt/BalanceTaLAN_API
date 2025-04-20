"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickets = getTickets;
exports.addTicket = addTicket;
exports.getTicket = getTicket;
const prisma_1 = require("../generated/prisma");
const ResultStatus_1 = require("../types/ResultStatus");
const prisma = new prisma_1.PrismaClient();
function getTickets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tickets = yield prisma.problem.findMany({
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
        }
        catch (err) {
            console.error(err);
            return [];
        }
    });
}
function addTicket(firstname, lastname, placeAndArea, category, photos, title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const [person, place, categoryEntity] = yield Promise.all([
                tx.person.findFirst({
                    where: { firstName: firstname, lastName: lastname }
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
                    where: { name: category }
                })
            ]);
            if (!person || !place || !categoryEntity) {
                return ResultStatus_1.ResultStatus.INVALID_REQUEST;
            }
            const newTicket = yield tx.problem.create({
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
            const newMessage = yield tx.message.create({
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
                return ResultStatus_1.ResultStatus.INTERNAL_ERROR;
            }
            return ResultStatus_1.ResultStatus.OK;
        }));
    });
}
function getTicket(ticketId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ticket = yield prisma.problem.findFirst({
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
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
function transformTicket(ticket) {
    var _a, _b, _c, _d, _e, _f;
    return {
        id: ticket.id,
        firstName: ((_a = ticket.Person) === null || _a === void 0 ? void 0 : _a.firstName) || "",
        lastName: ((_b = ticket.Person) === null || _b === void 0 ? void 0 : _b.lastName) || "",
        place: `${(_d = (_c = ticket.Place) === null || _c === void 0 ? void 0 : _c.Area) === null || _d === void 0 ? void 0 : _d.letter} ${(_e = ticket.Place) === null || _e === void 0 ? void 0 : _e.number}`,
        category: ((_f = ticket.ProblemCategory) === null || _f === void 0 ? void 0 : _f.name) || "",
        title: ticket.title || "",
        messages: ticket.Message.map(message => {
            return {
                id: message.id,
            };
        })
    };
}
