import {Response} from "express";
import {Area, PrismaClient} from "../generated/prisma";
import {ResultStatus} from "../types/ResultStatus";
import {AreaDTO} from "../types/AreaDTO";
import {PlaceDTO} from "../types/PlaceDTO";

const prisma = new PrismaClient();

export async function getAreas(): Promise<AreaDTO[]> {
	let areas = await prisma.area.findMany({
		include: {
			Place: true
		}
	});
	let areasDTO = [] as AreaDTO[];
	for (let area of areas) {
		areasDTO.push({
			letter: area.letter,
			places: area.Place.map((place) => ({
				number: place.number,
			} as PlaceDTO)),
		} as AreaDTO);
	}

	return areasDTO;
}