
import { Component } from '../base/Component';
import { events } from '../common/events';

interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketData> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this._list = container.querySelector('.basket__list')!;
    this._button = container.querySelector('.basket__button')!;
    this._total = container.querySelector('.basket__price')!;

    this._button.addEventListener('click', () => {
      events.emit('basket:order-open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(
        this.createEmptyMessage()
      );
    }
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }

  set valid(value: boolean) {
    this._button.disabled = !value;
  }

  private createEmptyMessage(): HTMLElement {
    const message = document.createElement('p');
    message.textContent = 'Корзина пуста';
    message.classList.add('basket__empty');
    return message;
  }
}