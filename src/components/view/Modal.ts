import { Component } from '../base/Component';
import { events } from '../../main';

export class Modal extends Component<HTMLElement> {
  protected _content: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this._closeButton = container.querySelector('.modal__close')!;
    this._content = container.querySelector('.modal__content')!;

    this._closeButton.addEventListener('click', this.close.bind(this));

    container.addEventListener('click', (event) => {
      if (event.target === container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this._content.innerHTML = ''; // очищаем
    events.emit('modal:close');
  }
}