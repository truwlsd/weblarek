import { Api } from '../base/Api';
import { IProduct, IOrder } from '../../types';

export class ShopApi {
  private api: Api;

  constructor(apiInstance: Api) {
    this.api = apiInstance;
  }

  // Получение списка товаров
  async getProducts(): Promise<IProduct[]> {
    const res = await this.api.get<{ items: IProduct[] }>('/products');
    return res.items;
  }

  // Создание заказа
  async createOrder(order: IOrder) {
    return this.api.post('/order', order);
  }
}
