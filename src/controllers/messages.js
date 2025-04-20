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
exports.getPhoto = getPhoto;
exports.getMessage = getMessage;
exports.addMessage = addMessage;
const prisma_1 = require("../generated/prisma");
const ResultStatus_1 = require("../types/ResultStatus");
const prisma = new prisma_1.PrismaClient();
function getPhoto(messageId, photoId, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const photo = yield prisma.photos.findFirst({
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
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
function getMessage(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const message = yield prisma.message.findUnique({
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
            };
            return messageData;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
function addMessage(ticketId, content, firstName, lastName, photos) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const person = yield prisma.person.findFirst({
                where: {
                    firstName: firstName,
                    lastName: lastName
                }
            });
            if (!person) {
                return ResultStatus_1.ResultStatus.INVALID_REQUEST;
            }
            const ticket = yield prisma.problem.findFirst({
                where: {
                    id: ticketId
                }
            });
            if (!ticket) {
                return ResultStatus_1.ResultStatus.INVALID_REQUEST;
            }
            const message = yield prisma.message.create({
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
                return ResultStatus_1.ResultStatus.INTERNAL_ERROR;
            }
            return ResultStatus_1.ResultStatus.OK;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
