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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const responseHandler_1 = require("../utils/responseHandler");
const messages_1 = require("../controllers/messages");
const extractFiles_1 = require("../utils/extractFiles");
const ResultStatus_1 = require("../types/ResultStatus");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.get('/:messageId/photos/:photoId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId, photoId } = req.params;
    const photo = yield (0, messages_1.getPhoto)(parseInt(messageId), parseInt(photoId), res);
    if (!photo) {
        return (0, responseHandler_1.badRequestResponse)(res, 'Failed to get photo');
    }
    (0, responseHandler_1.okPhotoResponse)(res, photo);
}));
router.get('/:messageId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const ticket = yield (0, messages_1.getMessage)(parseInt(messageId));
    if (!ticket) {
        return (0, responseHandler_1.badRequestResponse)(res, 'Failed to get message');
    }
    (0, responseHandler_1.okResponseWithData)(res, ticket);
}));
router.post('', upload.array('photos'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.photos = (0, extractFiles_1.extractFiles)(req) || [];
    if (!body) {
        return (0, responseHandler_1.badRequestResponse)(res, 'Invalid data');
    }
    if (!body.firstName || !body.lastName || !body.photos || !body.content) {
        return (0, responseHandler_1.badRequestResponse)(res, 'Missing required fields');
    }
    const result = yield (0, messages_1.addMessage)(body.ticketId, body.content, body.firstName, body.lastName, body.photos);
    if (result == ResultStatus_1.ResultStatus.INTERNAL_ERROR) {
        (0, responseHandler_1.internalServerErrorResponse)(res, 'Failed to add message');
    }
    else if (result == ResultStatus_1.ResultStatus.INVALID_REQUEST) {
        (0, responseHandler_1.badRequestResponse)(res, 'Invalid response');
    }
    else {
        (0, responseHandler_1.createdResponse)(res);
    }
}));
exports.default = router;
