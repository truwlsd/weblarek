
import { Component } from '../base/Component';
import { events } from '../common/events';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _content: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this._closeButton = container.querySelector('.modal__close')!;
    this._content = container.querySelector('.modal__content')!;

    // Закрытие по крестику
    this._closeButton.addEventListener('click', this.close.bind(this));

    // Закрытие по клику вне контента
    container.addEventListener('click', (event) => {
      if (event.target === container) {
        this.close();
      }
    });

    // Запрет скролла при открытии
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    document.body.classList.add('page__wrapper_modal'); // если нужно блокировать скролл
    events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    document.body.classList.remove('page__wrapper_modal');
    this.content = document.createElement('div'); // очищаем
    events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}