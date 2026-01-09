
import { Card } from './Card';
import { events } from '../common/events';

export class CardBasket extends Card {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this._index = container.querySelector('.basket__item-index')!;
    this._deleteButton = container.querySelector('.basket__item-delete')!;

    this._deleteButton.addEventListener('click', () => {
      events.emit('basket:remove-item', { id: container.dataset.id! });
    });
  }

  set index(value: number) {
    this._index.textContent = (value + 1).toString();
  }
}