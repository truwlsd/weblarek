// src/components/view/Success.ts

import { Component } from '../base/Component';
import { events } from '../common/events';

interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected _closeButton: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._closeButton = container.querySelector('.order-success__close')!;
    this._total = container.querySelector('.order-success__description')!;

    this._closeButton.addEventListener('click', () => {
      events.emit('success:close');
    });
  }

  set total(value: number) {
    this._total.textContent = `Списано ${value} синапсов`;
  }
}