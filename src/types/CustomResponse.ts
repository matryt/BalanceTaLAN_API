export interface CustomResponse<T> {
	success: boolean;
	data: T | null;
	message: string | null;
}