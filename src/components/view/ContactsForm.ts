
import { Form } from './Form';
import { events } from '../common/events';

export class ContactsForm extends Form<{}> {
  protected onInputChange(field: string, value: string) {
    if (field === 'email') {
      events.emit('contacts.email:changed', { email: value });
    } else if (field === 'phone') {
      events.emit('contacts.phone:changed', { phone: value });
    }
  }

  protected handleSubmit() {
    events.emit('order:pay');
  }
}