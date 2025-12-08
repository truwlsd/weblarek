import { IBuyer } from '../../types';

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
  }

  // ← ВОТ ЭТА СТРОЧКА ВСЁ ИСПРАВЛЯЕТ
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
  }

  /**
   * Возвращает объект ошибок по полям. Если поле корректно — свойства для него нет.
   */
  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.data.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.data.address?.trim()) errors.address = 'Укажите адрес доставки';
    if (!this.data.email?.trim()) errors.email = 'Укажите емэйл';
    if (!this.data.phone?.trim()) errors.phone = 'Укажите телефон';

    return errors;
  }
}