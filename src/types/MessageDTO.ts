export interface MessageDTO {
	content: string,
	id: number,
	photos: {
		photoNumber: number,
		url : string
	}[]
}