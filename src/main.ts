
import './scss/styles.scss';

import { events } from './components/common/events';

import { CatalogModel } from './components/model/CatalogModel';
import { CartModel } from './components/model/CartModel';
import { BuyerModel } from './components/model/BuyerModel';

import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';

import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types';

// Модели
const catalogModel = new CatalogModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// Компоненты
const page = new Page(document.body);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const mockProducts: IProduct[] = [
  {
    id: '1',
    title: '+1 час в сутках',
    description: 'Антистресс для программистов. Если планируете решать задачи в тренажёре, берите два.',
    image: '/images/Substract.png',  
    category: 'софт-скил',
    price: 750
  },
  {
    id: '2',
    title: 'Фреймворк куки судьбы',
    description: 'Случайные решения задач. Идеально для тех, кто устал от детерминизма.',
    image: '/images/Substract.png',
    category: 'хард-скил',
    price: 2500
  },
  {
    id: '3',
    title: 'Бэкенд-антистресс',
    description: 'Если планируете решать задачи в тренажёре, берите два.',
    image: '/images/Substract.png',
    category: 'другое',
    price: 1000
  },
  {
    id: '4',
    title: 'Кнопка «Всё будет»',
    description: 'Универсальная кнопка для любого проекта.',
    image: '/images/Substract.png',
    category: 'кнопка',
    price: null  
  }
];

// Загружаем мок
catalogModel.setItems(mockProducts);

// Обработчики событий
events.on('catalog:changed', ({ items }: { items: IProduct[] }) => {
  const catalogElements = items.map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate));
    card.element.dataset.id = item.id;
    card.title = item.title;
    card.image = item.image;
    card.category = item.category;
    card.price = item.price;
    return card.element;
  });
  page.catalog = catalogElements;
});

events.on('cart:changed', () => {
  page.basketCount = cartModel.getCount();
});

events.on('card:selected', ({ id }: { id: string }) => {
  catalogModel.setPreviewById(id);
});

events.on('preview:changed', ({ product }: { product: IProduct | null }) => {
  if (!product) return;

  const card = new CardPreview(cloneTemplate(cardPreviewTemplate));
  card.element.dataset.id = product.id;
  card.title = product.title;
  card.image = product.image;
  card.category = product.category;
  card.price = product.price;
  card.description = product.description || '';
  card.inBasket = cartModel.hasItem(product.id);
  card.buttonDisabled = product.price === null;

  modal.content = card.element;
  modal.open();
});

events.on('card:toggle-basket', ({ id }: { id: string }) => {
  const product = catalogModel.getItem(id);
  if (!product) return;

  if (cartModel.hasItem(id)) {
    cartModel.removeItem(id);
  } else {
    cartModel.addItem(product);
  }
  modal.close();
});

events.on('basket:open', () => {
  const basket = new Basket(cloneTemplate(basketTemplate));

  const items = cartModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate));
    card.element.dataset.id = item.id;
    card.title = item.title;
    card.price = item.price;
    card.index = index;
    return card.element;
  });

  basket.items = items;
  basket.total = cartModel.getTotal();
  basket.valid = cartModel.getCount() > 0;

  modal.content = basket.element;
  modal.open();
});

events.on('basket:remove-item', ({ id }: { id: string }) => {
  cartModel.removeItem(id);
});

events.on('basket:order-open', () => {
  const form = new OrderForm(cloneTemplate(orderTemplate));
  modal.content = form.element;
  modal.open();
});

events.on('order.payment:changed', ({ payment }: { payment: 'card' | 'cash' }) => {
  buyerModel.setField('payment', payment);
});

events.on('order.address:changed', ({ address }: { address: string }) => {
  buyerModel.setField('address', address);
});

events.on('order:next', () => {
  const form = new ContactsForm(cloneTemplate(contactsTemplate));
  modal.content = form.element;
  modal.open();
});

events.on('contacts.email:changed', ({ email }: { email: string }) => {
  buyerModel.setField('email', email);
});

events.on('contacts.phone:changed', ({ phone }: { phone: string }) => {
  buyerModel.setField('phone', phone);
});

events.on('order:pay', () => {
  const buyerData = buyerModel.getData();

  console.log('Заказ (мок):', {
    payment: buyerData.payment,
    address: buyerData.address,
    email: buyerData.email,
    phone: buyerData.phone,
    items: cartModel.getItems().map(i => i.id),
    total: cartModel.getTotal()
  });

  const success = new Success(cloneTemplate(successTemplate));
  success.total = cartModel.getTotal();

  modal.content = success.element;
  modal.open();

  cartModel.clear();
  buyerModel.clear();
});

events.on('success:close', () => {
  modal.close();
});