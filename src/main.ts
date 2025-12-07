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
  console.log('Cart after remove:', cart.getItems());
}

cart.addItem(first!);
cart.clear();
console.log('Cart after clear:', cart.getItems());

buyer.setField('address', 'ул. Тест, д.1');
buyer.setField('payment', 'card');
buyer.setField('email', 'test@example.com');
buyer.setField('phone', '+123456789');
console.log('Buyer data:', buyer.getData());
console.log('Buyer validation (should be empty):', buyer.validate());

console.groupEnd();

// API test using base Api and ShopApi
const apiOrigin = (import.meta.env.VITE_API_ORIGIN as string) ?? 'https://larek-api.nomoreparties.co';
const baseApi = new Api(apiOrigin);
const shopApi = new ShopApi(baseApi);

shopApi.getProducts().then(products => {
  console.log('Products fetched from server (first 5):', products.slice(0, 5));
}).catch(err => {
  console.error('Error fetching products from server (this is expected when offline):', err);
});