import Api from '../base/Api';
import { IProduct, IOrder } from '../../types';

export class ShopApi {
	private api: Api;

	constructor(apiInstance: Api) {
		this.api = apiInstance;
	}

	// сервер ожидает /product/
	async getProducts(): Promise<IProduct[]> {
		const res = await this.api.get<{ items: IProduct[] }>('/product/');
		return res.items;
	}

	// POST /order/
	async createOrder(order: IOrder): Promise<void> {
		return this.api.post('/order/', order);
	}
}
