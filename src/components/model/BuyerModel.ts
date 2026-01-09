
import { IBuyer } from '../../types';
import { events } from '../common/events';

type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel {
  private data: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: ''
  };

  setField<K extends keyof IBuyer>(key: K, value: IBuyer[K]): void {
    this.data[key] = value;
    events.emit('buyer:changed', this.getData());
  }

  getData(): IBuyer {
    return { ...this.data };
  }

  clear(): void {
    this.data = {
      payment: null,
      email: '',
      phone: '',
      address: ''
    };
    events.emit('buyer:changed', this.getData());
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.data.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.data.address?.trim()) errors.address = 'Укажите адрес доставки';
    if (!this.data.email?.trim()) errors.email = 'Укажите емэйл';
    if (!this.data.phone?.trim()) errors.phone = 'Укажите телефон';

    return errors;
  }
}