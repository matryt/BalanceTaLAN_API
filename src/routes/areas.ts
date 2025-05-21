import express from "express";
import multer from "multer";
import {getPhoto} from "../controllers/messages";
import {badRequestResponse, okPhotoResponse, okResponseWithData} from "../utils/responseHandler";
import {getAreas} from "../controllers/areas";

const router = express.Router();

router.get('', async (req, res) => {
	const areas = await getAreas();
	if (!areas) {
		return badRequestResponse(res, "Error fetching areas");
	}
	return okResponseWithData(res, areas);
});

export default router;