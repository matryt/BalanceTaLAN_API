export interface AddMessageDTO {
	firstName: string;
	lastName: string;
	photos: Buffer[],
	content: string;
	ticketId: number;
}