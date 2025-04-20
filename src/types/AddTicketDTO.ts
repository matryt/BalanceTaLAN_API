export interface AddTicketDTO {
	firstName: string;
	lastName: string;
	placeAndArea: string;
	category: string;
	photos: Buffer[],
	title: string,
	description: string;
}