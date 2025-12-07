export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrder {
	payment: TPayment | null;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;
}

export interface IBuyer {
	payment: TPayment | null;
	email: string;
	phone: string;
	address: string;
}
