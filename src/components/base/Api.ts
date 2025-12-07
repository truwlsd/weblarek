import { IApi, ApiPostMethods } from '../../types';

export class Api implements IApi {
    constructor(protected readonly baseUrl: string) {}

    protected handleResponse(response: Response) {
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        return response.json();
    }

    get<T extends object>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri).then(this.handleResponse);
    }

    post<T extends object>(
        uri: string,
        data: object = {},
        method: ApiPostMethods = 'POST'
    ): Promise<T> {
        return fetch(this.baseUrl + uri, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}
