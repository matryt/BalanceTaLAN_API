import express, {Request, Response} from 'express';
import {addTicket, getTicket, getTickets} from "../controllers/tickets";
import {AddTicketDTO} from "../types/AddTicketDTO";
import multer from 'multer';
import {
	badRequestResponse,
	createdResponse,
	internalServerErrorResponse,
	okResponseWithData
} from "../utils/responseHandler";
import {TicketDTO} from "../types/TicketDTO";
import {extractFiles} from "../utils/extractFiles";
import {ResultStatus} from "../types/ResultStatus";

const router = express.Router();
const upload = multer();

router.get('/all', async (req: Request, res: Response) => {
	const tickets = await getTickets();
	if (!tickets) {
		return badRequestResponse(res, 'Failed to get tickets');
	}
	okResponseWithData<TicketDTO[]>(res, tickets || []);
});

router.post('', upload.array('photos'), async (req: Request, res: Response) => {
	const body: AddTicketDTO = req.body;
	body.photos = extractFiles(req) || [];


	if (!body) {
		return badRequestResponse(res, 'Invalid data');
	}

	if (!body.firstName || !body.lastName || !body.placeAndArea || !body.category ||
		!body.photos || !body.title) {
		return badRequestResponse(res, 'Missing required fields');
	}

	const result = await addTicket(body.firstName, body.lastName, body.placeAndArea, body.category,
		body.photos, body.title, body.description);
	if (result == ResultStatus.OK) {
		createdResponse(res);
	} else if (result == ResultStatus.INVALID_REQUEST) {
		badRequestResponse(res, 'Invalid request');
	}
	else {
		internalServerErrorResponse(res, 'Failed to add ticket');
	}

});

router.get('/:ticketId', async (req, res) => {
	const { ticketId } = req.params;
	const ticket = await getTicket(parseInt(ticketId));
	if (!ticket) {
		return badRequestResponse(res, 'Failed to get ticket');
	}
	okResponseWithData<TicketDTO>(res, ticket);
});

export default router;