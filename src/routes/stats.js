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
const responseHandler_1 = require("../utils/responseHandler");
const stats_1 = require("../controllers/stats");
const router = express_1.default.Router();
router.get("/globalStats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield (0, stats_1.getGlobalStats)();
        return (0, responseHandler_1.okResponseWithData)(res, [stats]);
    }
    catch (error) {
        return (0, responseHandler_1.badRequestResponse)(res, "Failed to fetch global stats");
    }
}));
router.get("/areaStats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const areaLetter = req.query.areaLetter;
        if (!areaLetter) {
            return (0, responseHandler_1.badRequestResponse)(res, "Area ID is required");
        }
        const stats = yield (0, stats_1.getStatsByArea)(areaLetter);
        if (!stats) {
            return (0, responseHandler_1.badRequestResponse)(res, "Area not found");
        }
        return (0, responseHandler_1.okResponseWithData)(res, [stats]);
    }
    catch (error) {
        return (0, responseHandler_1.badRequestResponse)(res, "Failed to fetch area stats or area not found");
    }
}));
router.get("/placeStats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const areaLetter = req.query.areaLetter;
        const placeNumber = req.query.placeNumber;
        if (!areaLetter || !placeNumber) {
            return (0, responseHandler_1.badRequestResponse)(res, "Area ID and Place Number are required");
        }
        const stats = yield (0, stats_1.getStatsByPlace)(areaLetter, +placeNumber);
        if (!stats) {
            return (0, responseHandler_1.badRequestResponse)(res, "Place not found");
        }
        return (0, responseHandler_1.okResponseWithData)(res, [stats]);
    }
    catch (error) {
        return (0, responseHandler_1.badRequestResponse)(res, "Failed to fetch place stats or place not found");
    }
}));
exports.default = router;
