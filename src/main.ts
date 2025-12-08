// src/main.ts

import './scss/styles.scss';

import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { ShopApi } from './components/Models/ShopApi';
import { Api } from './components/base/Api';

import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { IOrder } from './types';

console.group('Проверка всех моделей и API');

const catalog = new CatalogModel();
const cart = new CartModel();
const buyer = new BuyerModel();

catalog.setItems(apiProducts.items);

const firstItem = catalog.getItems()[0];
const secondItem = catalog.getItems()[1];
if (firstItem) cart.addItem(firstItem);
if (secondItem) cart.addItem(secondItem);

buyer.setField('email', 'test@weblarek.ru');
buyer.setField('phone', '+79991234567');
buyer.setField('address', 'г. Москва, ул. Тестовая, д. 1');
buyer.setField('payment', 'card');

const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);

shopApi.getProducts()
  .then(products => {
    catalog.setItems(products);
  })
  .catch(err => console.error(err));

const order: IOrder = {
  ...buyer.getData(),
  items: cart.getItems().map(item => item.id),
  total: cart.getTotal(),
};

shopApi.createOrder(order)
  .then(response => {
    console.log('Заказ создан:', response.id, response.total);
  })
  .catch(err => console.error(err));

console.groupEnd();