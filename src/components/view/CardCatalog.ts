import { Card } from './Card';
import { events } from '../../main';

export class CardCatalog extends Card {
  constructor(container: HTMLElement) {
    super(container);

    container.addEventListener('click', () => {
      const id = container.dataset.id;
      if (id) {
        events.emit('card:selected', { id });
      } else {
        console.warn('Нет id у карточки');
      }
    });
  }
}