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
const tickets_1 = require("../controllers/tickets");
const multer_1 = __importDefault(require("multer"));
const responseHandler_1 = require("../utils/responseHandler");
const extractFiles_1 = require("../utils/extractFiles");
const ResultStatus_1 = require("../types/ResultStatus");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield (0, tickets_1.getTickets)();
    if (!tickets) {
        return (0, responseHandler_1.badRequestResponse)(res, 'Failed to get tickets');
    }
    (0, responseHandler_1.okResponseWithData)(res, tickets || []);
}));
router.post('', upload.array('photos'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.photos = (0, extractFiles_1.extractFiles)(req) || [];
    if (!body) {
        return (0, responseHandler_1.badRequestResponse)(res, 'Invalid data');
    }
    if (!body.firstName || !body.lastName || !body.placeAndArea || !body.category ||
        !body.photos || !body.title) {
        return (0, responseHandler_1.badRequestResponse)(res, 'Missing required fields');
    }
    const result = yield (0, tickets_1.addTicket)(body.firstName, body.lastName, body.placeAndArea, body.category, body.photos, body.title, body.description);
    if (result == ResultStatus_1.ResultStatus.OK) {
        (0, responseHandler_1.createdResponse)(res);
    }
    else if (result == ResultStatus_1.ResultStatus.INVALID_REQUEST) {
        (0, responseHandler_1.badRequestResponse)(res, 'Invalid request');
    }
    else {
        (0, responseHandler_1.internalServerErrorResponse)(res, 'Failed to add ticket');
    }
}));
router.get('/:ticketId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    const ticket = yield (0, tickets_1.getTicket)(parseInt(ticketId));
    if (!ticket) {
        return (0, responseHandler_1.badRequestResponse)(res, 'Failed to get ticket');
    }
    (0, responseHandler_1.okResponseWithData)(res, ticket);
}));
exports.default = router;
