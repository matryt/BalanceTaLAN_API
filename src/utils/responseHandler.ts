import {CustomResponse} from "../types/CustomResponse";
import { Response } from 'express';

export const okPhotoResponse = (res: Response, photo: Buffer) => {
	res.setHeader('Content-Type', 'image/jpeg');
	res.setHeader('Content-Length', photo.length || 0);
	res.setHeader('Cache-Control', 'public, max-age=31536000');
	res.status(200).send(photo);
}

export const okResponseWithData = <T>(res: Response, data: T) => {
	const response: CustomResponse<T> = {
		success: true,
		message: 'OK',
		data: data,
	}
	res.status(200).json(response);
}

export const createdResponse = (res: Response) => {
	const response: CustomResponse<void> = {
		success: true,
		message: 'Created',
		data: null,
	}
	res.status(201).json(response);
}

export const badRequestResponse = (res: Response, message: string) => {
	const response: CustomResponse<void> = {
		success: false,
		message: message,
		data: null,
	}
	res.status(400).json(response);
}

export const internalServerErrorResponse = (res: Response, message: string) => {
	const response: CustomResponse<void> = {
		success: false,
		message: message,
		data: null,
	}
	res.status(500).json(response);
}

export const notFoundResponse = (res: Response, message: string) => {
	const response: CustomResponse<void> = {
		success: false,
		message: message,
		data: null,
	}
	res.status(404).json(response);
}