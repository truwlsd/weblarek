import { Form } from './Form';
import { events } from '../../main';

export class ContactsForm extends Form<{}> {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;

  private _email: string = '';
  private _phone: string = '';

  constructor(container: HTMLFormElement) {
    super(container);

    this._emailInput = container.querySelector('input[name="email"]')!;
    this._phoneInput = container.querySelector('input[name="phone"]')!;

    this._emailInput.addEventListener('input', () => {
      this._email = this._emailInput.value.trim();
      this.validateForm();
    });

    this._phoneInput.addEventListener('input', () => {
      this._phone = this._phoneInput.value.trim();
      this.validateForm();
    });

    this.validateForm();
  }

  private validateForm() {
    const emailError = this._email.includes('@') && this._email.length > 5 ? '' : 'Некорректный email';
    const phoneError = this._phone.length >= 10 ? '' : 'Некорректный номер телефона';

    this.errors = [emailError, phoneError].filter(Boolean);

    this.valid = !emailError && !phoneError;
  }

  protected handleSubmit() {
    if (this.valid) {
      events.emit('order:pay');
    }
  }
}