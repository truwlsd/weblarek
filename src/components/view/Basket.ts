import { Component } from '../base/Component';
import { events } from '../../main';

interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketData> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _emptyMessage: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._list = container.querySelector('.basket__list')!;
    this._total = container.querySelector('.basket__price')!;
    this._button = container.querySelector('.basket__button')!;

    this._emptyMessage = (container.querySelector('.basket__empty') as HTMLElement) || document.createElement('p');
    if (!this._emptyMessage.parentElement) {
      this._emptyMessage.textContent = 'Корзина пуста';
      this._list.appendChild(this._emptyMessage);
    }

    this._button.addEventListener('click', () => {
      events.emit('basket:order-open');
    });
  }

  set items(items: HTMLElement[]) {
    this._list.replaceChildren(...items);

    const emptyMessage = this._emptyMessage as HTMLElement;
    if (emptyMessage) {
      emptyMessage.style.display = items.length === 0 ? 'block' : 'none';
    }
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }

  set valid(value: boolean) {
    this._button.disabled = !value;
  }
}