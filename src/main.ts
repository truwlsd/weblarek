import './scss/styles.scss';
import {ProductsCatalog} from "./components/Models/ProductCatalog.ts";
import {Basket} from "./components/Models/Basket.ts";
import {API_URL, CDN_URL} from "./utils/constants.ts";
import {Api} from "./components/base/Api.ts";
import {LarekApi} from "./components/base/LarekApi.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {CardCatalog} from "./components/Views/CardCatalog.ts";
import {cloneTemplate, ensureElement} from "./utils/utils.ts";
import {Gallery} from "./components/Views/Gallery.ts";
import {Modal} from "./components/Views/Modal.ts";
import {CardPreview} from "./components/Views/CardPreview.ts";
import {Header} from "./components/Views/Header.ts";
import {BasketView} from "./components/Views/BasketView.ts";
import {CardBasket} from "./components/Views/CardBasket.ts";
import {IProduct, IOrderRequest} from "./types";
import {Buyer} from "./components/Models/Buyer.ts";
import { OrderForm } from "./components/Views/OrderForm.ts";
import { ContactsForm } from "./components/Views/ContactsForm.ts";
import { Success } from "./components/Views/Success.ts";

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const modalContainer = ensureElement<HTMLElement>('#modal-container')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new Api(API_URL)
const larekAPI = new LarekApi(api)
const events = new EventEmitter();

const productCatalog = new ProductsCatalog(events)
const basketModel = new Basket(events)
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'))
const header = new Header(events, ensureElement<HTMLElement>('.header'))
const modal = new Modal(modalContainer, events)

const basketView = new BasketView(cloneTemplate(basketTemplate), {
  onClick: () => {
    events.emit('basket:orderNew')
  }
})
const buyerModel = new Buyer(events)

const orderForm = new OrderForm(events, cloneTemplate(orderTemplate), 'order:submit');
const contactsForm = new ContactsForm(events, cloneTemplate(contactsTemplate), 'contacts:submit');
const successView = new Success(cloneTemplate(successTemplate), events);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onClick: () => {
    events.emit('preview:action');
  }
});

async function getProductsServer() {
  try {
    const products = await larekAPI.getProductList();
    productCatalog.setProducts(products);
  } catch (error) {
    console.error(error);
  }
}

events.on('products:changed', () => {
  const products = productCatalog.getProducts();

  const cards = products.map(product => {
    const cardElement = cloneTemplate(cardCatalogTemplate)
    const card = new CardCatalog(cardElement, {
      onClick: () => {
        events.emit('card:selected', product);
      }
    })
    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: CDN_URL + product.image
    })
  })

  gallery.render({catalog: cards})
})

events.on('card:selected', (product: IProduct) => {
  productCatalog.setSelectedProduct(product)
})

events.on('product:selected', () => {
  const selectedProduct = productCatalog.getSelectedProduct();
  if (!selectedProduct) return;

  const isInBasket = basketModel.productInCart(selectedProduct.id);
  const { buttonText } = getButtonConfig(selectedProduct, isInBasket);

  const cardRender = cardPreview.render({
    title: selectedProduct.title,
    image: CDN_URL + selectedProduct.image,
    price: selectedProduct.price,
    category: selectedProduct.category,
    description: selectedProduct.description,
    buttonText: buttonText
  });

  modal.render({content: cardRender})
  modal.open()
});

events.on('preview:action', () => {
    const selectedProduct = productCatalog.getSelectedProduct();
    if (!selectedProduct) return;
    if (!selectedProduct.price) return;

    if (basketModel.productInCart(selectedProduct.id)) {
        basketModel.removeProduct(selectedProduct);
    } else {
        basketModel.setProductCart(selectedProduct);
    }
    modal.close();
});

function getButtonConfig(product: IProduct, isInBasket: boolean) {
  if (isInBasket) {
    return { buttonText: 'Удалить из корзины' };
  } else if (product.price) {
    return { buttonText: 'В корзину' };
  } else {
    return { buttonText: 'Недоступно' };
  }
}

events.on('basket:deleteProduct', (product: IProduct) => {
  basketModel.removeProduct(product)
})

events.on('basket:open', () => {
  events.emit('basket:changed');
  modal.render({ content: basketView.render()});
  modal.open();
})

events.on('basket:changed', () => {
  const products = basketModel.getProductsCart();
  const cards = products.map((product, index) => {
    const cardElement = cloneTemplate(cardBasketTemplate);
    const card = new CardBasket(cardElement, {
      onClick: () => {
        events.emit('basket:deleteProduct', product);
      }
    });
    return card.render({
      title: product.title,
      price: product.price,
      index: index
    });
  });

  const isEmpty = cards.length === 0;
  const totalPrice = String(basketModel.basketCost());

  basketView.content = isEmpty ? ['Корзина пуста'] : cards;
  basketView.price = totalPrice;
  basketView.disabled = isEmpty;

  header.render({ counter: products.length });
})

events.on('basket:orderNew', () => {
  const data = buyerModel.getData();
  
  orderForm.payment = data.payment;
  orderForm.address = data.address;

  modal.render({
      content: orderForm.render({
          valid: false,
          errors: []
      })
  });
  
  const validation = buyerModel.validate();
  orderForm.valid = !validation.errors.address && !validation.errors.payment;
})

events.on('order:payment', (data: { value: string }) => {
  buyerModel.setPayment(data.value)
})

events.on('order:input', (data: { value: string }) => {
  buyerModel.setAddress(data.value)
})

events.on('contacts:input', (data: { field: string, value: string }) => {
  if(data.field === 'email') {
    buyerModel.setEmail(data.value)
  } else {
    buyerModel.setPhone(data.value)
  }
})

events.on('buyer:changed', () => {
    const validation = buyerModel.validate();
    const data = buyerModel.getData();

    console.group(' DEBUG: buyer:changed');
    
    console.log('Данные из модели', data);
    
    console.log('ERRORS (Ошибки валидации', validation.errors);
    
    const addressOk = !validation.errors.address;
    const paymentOk = !validation.errors.payment;
    const finalValid = addressOk && paymentOk;
    
    console.log(` Адрес ${addressOk}`);
    console.log(`Оплата  ${paymentOk}`);
    console.log(`отправляем в форму ${finalValid}`);
    
    console.groupEnd();

    orderForm.valid = finalValid;
    
    orderForm.errors = [validation.errors.address, validation.errors.payment].filter(i => !!i) as string[];
    orderForm.payment = data.payment;

    contactsForm.valid = !validation.errors.email && !validation.errors.phone;
    contactsForm.errors = [validation.errors.email, validation.errors.phone].filter(i => !!i) as string[];
});

events.on('order:submit', () => {
  const data = buyerModel.getData();
  
  contactsForm.email = data.email;
  contactsForm.phone = data.phone;
  
  modal.render({content: contactsForm.render()});
  
  const validation = buyerModel.validate();
  contactsForm.valid = !validation.errors.email && !validation.errors.phone;
})

events.on('contacts:submit', async () => {
  const validation = buyerModel.validate()
  
  if (validation.isValid) {
    try {
      const orderRequest: IOrderRequest = {
        ...buyerModel.getData(),
        total: basketModel.basketCost(),
        items: basketModel.getProductsCart().map(item => item.id)
      };
      const result = await larekAPI.submitOrder(orderRequest);
      modal.render({content: successView.render({total: result.total})})

      basketModel.clearingCart();
      buyerModel.clear(); 
      
    } catch (error) {
      console.error(error);
    }
  } 
})

events.on('success:close', () => {
  modal.close();
});

getProductsServer();