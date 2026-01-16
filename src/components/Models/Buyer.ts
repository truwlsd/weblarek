import { IBuyer, Validation } from "../../types";
import { IEvents } from "../base/Events.ts";

export class Buyer {
  private payment: string = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(private events: IEvents) {}

  setPayment(payment: string) {
    console.log('BuyerModel: Setting payment to:', payment);
    this.payment = payment;
    this.events.emit('buyer:changed');
  }

  setEmail(email: string) {
    this.email = email;
    this.events.emit('buyer:changed');
  }

  setPhone(phone: string) {
    this.phone = phone;
    this.events.emit('buyer:changed');
  }

  setAddress(address: string) {
    console.log('BuyerModel: Setting address to:', address);
    this.address = address;
    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear() {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit('buyer:changed');
  }

  validate(): Validation {
    const errors: Validation['errors'] = {};

    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (!this.address) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this.email) {
      errors.email = 'Укажите email';
    }

    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }
    
    // Лог: Что модель думает о валидности
    // console.log('BuyerModel: Validation result:', errors);

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}