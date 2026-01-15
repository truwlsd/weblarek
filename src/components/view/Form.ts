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

    this.valid = false;
    this.errors = [];
  }

  protected onInputChange(field: keyof T, value: string) {}

  protected handleSubmit() {}

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this._errors.textContent = value.join('; ');
  }

  render(state?: IFormState & Partial<T>): HTMLElement {
    if (state) {
      super.render(state);
      this.valid = state.valid ?? false;
      this.errors = state.errors ?? [];
    }
    return this.container;
  }
}