
import { Form } from './Form';
import { events } from '../common/events';

export class OrderForm extends Form<{}> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement) {
    super(container);

    this._cardButton = container.querySelector('button[name="card"]')!;
    this._cashButton = container.querySelector('button[name="cash"]')!;

    this._cardButton.addEventListener('click', () => this.setPayment('card'));
    this._cashButton.addEventListener('click', () => this.setPayment('cash'));
  }

  private setPayment(payment: 'card' | 'cash') {
    this._cardButton.classList.toggle('button_alt-active', payment === 'card');
    this._cashButton.classList.toggle('button_alt-active', payment === 'cash');
    events.emit('order.payment:changed', { payment });
  }

  protected onInputChange(field: string, value: string) {
    if (field === 'address') {
      events.emit('order.address:changed', { address: value });
    }
  }

  protected handleSubmit() {
    events.emit('order:next');
  }
}