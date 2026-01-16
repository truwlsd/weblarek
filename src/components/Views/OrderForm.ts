import { Form } from "./Form.ts";
import { IEvents } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";

export interface IOrderForm {
  payment: string;
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement, eventName: string) {
    super(events, container, eventName);
    
    // Ищем кнопки более явно
    this.paymentButtons = Array.from(this.container.querySelectorAll('.order__buttons button'));
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    
    this.initPaymentButtons();
    this.initAddressInput();
  }

  private initPaymentButtons(): void {
    this.paymentButtons.forEach(button => {
      button.type = 'button'; // Защита от сабмита
      button.addEventListener('click', () => {
        const paymentName = button.getAttribute('name');
        console.log('OrderForm: Clicked payment button:', paymentName); // ЛОГ 1
        this.events.emit('order:payment', {value: paymentName})
      });
    });
  }

  private initAddressInput(): void {
    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:input', {field: 'address', value: this.addressInput.value});
    });
  }

  set payment(payment: string) {
    console.log('OrderForm: Setting payment visual state to:', payment); // ЛОГ 4

    this.paymentButtons.forEach(btn => {
      // Сбрасываем активный класс
      btn.classList.remove('button_alt-active');
    });

    // Ищем кнопку, у которой атрибут name совпадает с выбранным
    const selectedButton = this.paymentButtons.find(btn => btn.getAttribute('name') === payment);
    
    if (selectedButton) {
      console.log('OrderForm: Found button, adding class button_alt-active'); // ЛОГ 5
      selectedButton.classList.add('button_alt-active');
    } else {
        console.log('OrderForm: Button not found for payment type:', payment);
    }
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}