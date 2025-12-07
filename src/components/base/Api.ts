import { IApi, ApiPostMethods } from '../../types';

export class Api implements IApi {
    constructor(protected readonly baseUrl: string) {}

    protected handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        return response.json();
    }

    get<T>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => this.handleResponse<T>(res));
    }

    post<T>(
        uri: string,
        data: object,
        method: ApiPostMethods = 'POST'
    ): Promise<T> {
        return fetch(this.baseUrl + uri, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(res => this.handleResponse<T>(res));
    }
}
