import express, { Request, Response } from 'express';
import multer from 'multer';
import {
	badRequestResponse, createdResponse, internalServerErrorResponse,
	okPhotoResponse,
	okResponseWithData
} from "../utils/responseHandler";
import {addMessage, getMessage, getPhoto} from "../controllers/messages";
import {MessageDTO} from "../types/MessageDTO";
import {AddMessageDTO} from "../types/AddMessageDTO";
import {extractFiles} from "../utils/extractFiles";
import {ResultStatus} from "../types/ResultStatus";

const router = express.Router();
const upload = multer();

router.get('/:messageId/photos/:photoId', async (req, res) => {
	const { messageId, photoId } = req.params;
	const photo = await getPhoto(parseInt(messageId), parseInt(photoId), res);
	if (!photo) {
		return badRequestResponse(res, 'Failed to get photo');
	}
	okPhotoResponse(res, photo);
});

router.get('/:messageId', async (req, res) => {
	const { messageId } = req.params;
	const ticket = await getMessage(parseInt(messageId));
	if (!ticket) {
		return badRequestResponse(res, 'Failed to get message');
	}
	okResponseWithData<MessageDTO>(res, ticket);
});

router.post('', upload.array('photos'), async (req: Request, res: Response) => {
	const body: AddMessageDTO = req.body;

	body.photos = extractFiles(req) || [];

	if (!body) {
		return badRequestResponse(res, 'Invalid data');
	}

	if (!body.firstName || !body.lastName || !body.photos || !body.content) {
		return badRequestResponse(res, 'Missing required fields');
	}

	const result = await addMessage(body.ticketId, body.content, body.firstName, body.lastName,
		body.photos);
	if (result == ResultStatus.INTERNAL_ERROR) {
		internalServerErrorResponse(res, 'Failed to add message');
	} else if (result == ResultStatus.INVALID_REQUEST) {
		badRequestResponse(res, 'Invalid response');
	}
	else {
		createdResponse(res);
	}
});

export default router;