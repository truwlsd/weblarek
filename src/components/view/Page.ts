
import { Component } from '../base/Component';
import { events } from '../common/events';

export class Page extends Component<HTMLElement> {
  protected _gallery: HTMLElement;
  protected _basketCounter: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this._gallery = container.querySelector('.gallery')!;
    this._basketCounter = container.querySelector('.header__basket-counter')!;
    this._basketButton = container.querySelector('.header__basket')!;

    this._basketButton.addEventListener('click', () => {
      events.emit('basket:open');
    });
  }

  set catalog(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  set basketCount(value: number) {
    this._basketCounter.textContent = value.toString();
  }
}