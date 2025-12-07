import './scss/styles.scss';

import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { ShopApi } from './components/Models/ShopApi';

import Api from './components/base/Api';
import { apiProducts } from './utils/data';

console.group('Models test');

const catalog = new CatalogModel();
const cart = new CartModel();
const buyer = new BuyerModel();

console.log('Initial catalog items:', catalog.getItems());

catalog.setItems(apiProducts.items);
console.log('Catalog after setItems:', catalog.getItems());

const first = catalog.getItems()[0];
console.log('First item:', first);

catalog.setPreview(first ?? null);
console.log('Preview item:', catalog.getPreview());

if (first) {
  cart.addItem(first);
  console.log('Cart items after add:', cart.getItems());
  console.log('Cart total:', cart.getTotal());
  console.log('Cart count:', cart.getCount());
  console.log('Has first in cart:', cart.hasItem(first.id));

  cart.removeItem(first.id);
  console.log('Cart items after remove:', cart.getItems());
}

const apiOrigin = (import.meta.env.VITE_API_ORIGIN as string) ?? 'https://larek-api.nomoreparties.co';
const baseApi = new Api(apiOrigin);
const shopApi = new ShopApi(baseApi);

// используем buyer и shopApi, чтобы убрать предупреждения о неиспользуемых переменных
console.log(buyer);
console.log(shopApi);

console.groupEnd();
