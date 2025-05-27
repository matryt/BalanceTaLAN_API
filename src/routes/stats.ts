import express from "express";
import {badRequestResponse, okResponseWithData} from "../utils/responseHandler";
import {getGlobalStats, getStatsByArea, getStatsByPlace} from "../controllers/stats";

const router = express.Router();

router.get("/globalStats", async (req, res) => {
	try {
		const stats = await getGlobalStats();
		return okResponseWithData(res, [stats]);
	}
	catch (error) {
		return badRequestResponse(res, "Failed to fetch global stats");
	}
});

router.get("/areaStats", async (req, res) => {
	try {
		const areaLetter = req.query.areaLetter as string;
		if (!areaLetter) {
			return badRequestResponse(res, "Area ID is required");
		}
		const stats = await getStatsByArea(areaLetter);
		if (!stats) {
			return badRequestResponse(res, "Area not found");
		}
		return okResponseWithData(res, [stats]);
	}
	catch (error) {
		return badRequestResponse(res, "Failed to fetch area stats or area not found");
	}
});

router.get("/placeStats", async (req, res) => {
	try {
		const areaLetter = req.query.areaLetter as string;
		const placeNumber = req.query.placeNumber as string;
		if (!areaLetter || !placeNumber) {
			return badRequestResponse(res, "Area ID and Place Number are required");
		}
		const stats = await getStatsByPlace(areaLetter, +placeNumber);
		if (!stats) {
			return badRequestResponse(res, "Place not found");
		}
		return okResponseWithData(res, [stats]);
	}
	catch (error) {
		return badRequestResponse(res, "Failed to fetch place stats or place not found");
	}
});

export default router;