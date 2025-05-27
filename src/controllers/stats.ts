import {Prisma, PrismaClient} from "../generated/prisma";
import sql = Prisma.sql;

const prisma = new PrismaClient()

export async function getGlobalStats() {
	let stats = await prisma.$queryRaw<{}[]>(
		sql`SELECT * FROM getglobalstats()`
	);
	return stats[0];
}

export async function getStatsByArea(letter: string) {
	let stats;
	try {
		stats = await prisma.$queryRawUnsafe<{get_stats_area_by_letter: Object}[]>(
			`SELECT get_stats_area_by_letter('${letter}')`
		);
	} catch (_) {
		return null;
	}
	return stats[0].get_stats_area_by_letter;
}

export async function getStatsByPlace(letter: string, number: number) {
	let stats;
	try {
		stats = await prisma.$queryRawUnsafe<{get_stats_place_by_letter_and_number: Object}[]>(
			`SELECT get_stats_place_by_letter_and_number('${letter}', ${number})`
		);
	} catch (_) {
		return null;
	}
	return stats[0].get_stats_place_by_letter_and_number;
}