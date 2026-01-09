
import { Component } from '../base/Component';

interface IFormState {
  valid: boolean;
  errors: string[];
}

export abstract class Form<T> extends Component<IFormState> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement) {
    super(container);

    this._submitButton = container.querySelector('button[type="submit"]')!;
    this._errors = container.querySelector('.form__errors')!;

    container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  // @ts-ignore — параметры используются только в наследниках
  protected onInputChange(field: keyof T, value: string) {
    // Пустая реализация в базовом классе — переопределяется в дочерних
  }

  protected handleSubmit() {
    // Переопределяется в дочерних классах
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this._errors.textContent = value.join('; ');
  }

  render(state: IFormState & Partial<T>): HTMLElement {
    super.render(state);
    this.valid = state.valid;
    this.errors = state.errors || [];
    return this.container;
  }
}