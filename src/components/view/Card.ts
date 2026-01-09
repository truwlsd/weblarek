
import { Component } from '../base/Component';
import { categoryMap, CDN_URL } from '../../utils/constants';

export abstract class Card extends Component<HTMLElement> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._title = container.querySelector('.card__title')!;
    this._price = container.querySelector('.card__price')!;

    this._image = container.querySelector('.card__image') as HTMLImageElement | undefined;
    this._category = container.querySelector('.card__category') as HTMLElement | undefined;
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value === null ? 'Недоступно' : `${value} синапсов`;
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, CDN_URL + value, this._title.textContent || '');
    }
  }

  set category(value: string) {
    if (this._category) {
      Object.values(categoryMap).forEach(mod => this._category!.classList.remove(mod));
      const modifier = categoryMap[value as keyof typeof categoryMap];
      if (modifier) {
        this._category.classList.add(modifier);
      }
      this._category.textContent = value;
    }
  }
}