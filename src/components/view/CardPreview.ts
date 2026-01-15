import { Card } from './Card';
import { events } from '../../main';

export class CardPreview extends Card {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this._description = container.querySelector('.card__text')!;
    this._button = container.querySelector('.card__button')!;

    this._button.addEventListener('click', () => {
      events.emit('card:toggle-basket'); // без id
    });
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set inBasket(value: boolean) {
    this._button.textContent = value ? 'Удалить из корзины' : 'В корзину';
  }

  set buttonDisabled(value: boolean) {
    this._button.disabled = value;
  }
}