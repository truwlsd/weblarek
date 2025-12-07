export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    title: string;
    price: number | null;   
    description: string;
    image: string;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    items: string[];
    total: number;
}

export interface IBuyer {
    payment: string | null;
    email: string;
    phone: string;
    address: string;
}
