import { Api } from '../base/Api';
import { IProduct, IOrder, IOrderResponse } from '../../types';

export class ShopApi {
  private api: Api;

  constructor(apiInstance: Api) {
    this.api = apiInstance;
  }

  async getProducts(): Promise<IProduct[]> {
    const res = await this.api.get<{ items: IProduct[] }>('/product/');
    return res.items;
  }

  async createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}