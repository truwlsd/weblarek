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
            return Promise.reject(response.statusText);
        }
        return response.json();
    }

    get<T>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then((res) => this.handleResponse<T>(res));
    }

    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(this.options.headers ?? {})
            },
            body: JSON.stringify(data)
        }).then((res) => this.handleResponse<T>(res));
    }
}
