
import { Card } from './Card';
import { events } from '../common/events';

export class CardCatalog extends Card {
  constructor(container: HTMLElement) {
    super(container);

    container.addEventListener('click', () => {
      events.emit('card:selected', { id: container.dataset.id! });
    });
  }
}