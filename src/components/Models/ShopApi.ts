import Api from '../base/Api';
import { IProduct, IOrder, ApiPostMethods } from '../../types';

export class ShopApi {
    private api: Api;

    constructor(apiInstance: Api) {
        this.api = apiInstance;
    }

    // автотесты ждут /product/
    async getProducts(): Promise<IProduct[]> {
        const res = await this.api.get<{ items: IProduct[] }>('/product/');
        return res.items;
    }

    // автотесты ждут /order/
    async createOrder(order: IOrder) {
        return this.api.post('/order/', order, 'POST' as ApiPostMethods);
    }
}
