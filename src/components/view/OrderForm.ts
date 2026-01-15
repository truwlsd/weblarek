import { Form } from './Form';
import { events } from '../../main';

export class OrderForm extends Form<{}> {
  private _cardButton: HTMLButtonElement;
  private _cashButton: HTMLButtonElement;
  private _addressInput: HTMLInputElement;

  private _payment: 'card' | 'cash' | null = null;
  private _address: string = '';

  constructor(container: HTMLFormElement) {
    super(container);

    this._cardButton = container.querySelector('button[name="card"]')!;
    this._cashButton = container.querySelector('button[name="cash"]')!;
    this._addressInput = container.querySelector('input[name="address"]')!;

    // Выбор оплаты
    this._cardButton.addEventListener('click', () => {
      this._payment = 'card';
      this._cardButton.classList.add('button_active');
      this._cashButton.classList.remove('button_active');
      this.validateForm();
    });

    this._cashButton.addEventListener('click', () => {
      this._payment = 'cash';
      this._cashButton.classList.add('button_active');
      this._cardButton.classList.remove('button_active');
      this.validateForm();
    });

    // Адрес
    this._addressInput.addEventListener('input', () => {
      this._address = this._addressInput.value.trim();
      this.validateForm();
    });

    this.validateForm();
  }

  private validateForm() {
    const paymentError = this._payment ? '' : 'Не выбран способ оплаты';
    const addressError = this._address.length > 0 ? '' : 'Не указан адрес доставки';

    this.errors = [paymentError, addressError].filter(Boolean);

    this.valid = !paymentError && !addressError;
  }

  protected handleSubmit() {
    if (this.valid) {
      events.emit('order:next');
    }
  }
}