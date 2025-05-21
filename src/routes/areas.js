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
const areas_1 = require("../controllers/areas");
const router = express_1.default.Router();
router.get('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const areas = yield (0, areas_1.getAreas)();
    if (!areas) {
        return (0, responseHandler_1.badRequestResponse)(res, "Error fetching areas");
    }
    return (0, responseHandler_1.okResponseWithData)(res, areas);
}));
exports.default = router;
