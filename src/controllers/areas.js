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
exports.getAreas = getAreas;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function getAreas() {
    return __awaiter(this, void 0, void 0, function* () {
        let areas = yield prisma.area.findMany({
            include: {
                Place: true
            }
        });
        let areasDTO = [];
        for (let area of areas) {
            areasDTO.push({
                letter: area.letter,
                places: area.Place.map((place) => ({
                    number: place.number,
                })),
            });
        }
        return areasDTO;
    });
}
