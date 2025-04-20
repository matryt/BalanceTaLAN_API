import { Request } from 'express';

export function extractFiles(req: Request) {
	const bufferArray: Buffer[] = [];
	if (!req.files) {
		return false;
	}
	for (const file of req.files as Express.Multer.File[]) {
		bufferArray.push(file.buffer);
	}
	return bufferArray;
}