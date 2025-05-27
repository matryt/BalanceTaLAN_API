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
exports.getGlobalStats = getGlobalStats;
exports.getStatsByArea = getStatsByArea;
exports.getStatsByPlace = getStatsByPlace;
const prisma_1 = require("../generated/prisma");
var sql = prisma_1.Prisma.sql;
const prisma = new prisma_1.PrismaClient();
function getGlobalStats() {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = yield prisma.$queryRaw(sql `SELECT * FROM getglobalstats()`);
        return stats[0];
    });
}
function getStatsByArea(letter) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats;
        try {
            stats = yield prisma.$queryRawUnsafe(`SELECT get_stats_area_by_letter('${letter}')`);
        }
        catch (_) {
            return null;
        }
        return stats[0].get_stats_area_by_letter;
    });
}
function getStatsByPlace(letter, number) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats;
        try {
            stats = yield prisma.$queryRawUnsafe(`SELECT get_stats_place_by_letter_and_number('${letter}', ${number})`);
        }
        catch (_) {
            return null;
        }
        return stats[0].get_stats_place_by_letter_and_number;
    });
}
