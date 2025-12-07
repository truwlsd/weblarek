import { IApi, ApiPostMethods } from '../../types';

export default class Api implements IApi {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json'
            },
            ...(options ?? {})
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            return Promise.reject(`API error: ${response.status}`);
        }
        return response.json();
    }

    get<T>(uri: string): Promise<T> {
    return fetch(this.baseUrl + uri, {
        ...this.options,
        method: 'GET'
    }).then((response) => this.handleResponse<T>(response));
}


    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T> {
    return fetch(this.baseUrl + uri, {
        ...this.options,
        method: method ?? 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(this.options.headers ?? {})
        },
        body: JSON.stringify(data)
    }).then((response) => this.handleResponse<T>(response));
}
}
