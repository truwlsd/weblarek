import { IProduct } from '../../types';

export class CartModel {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this.items.push(product);
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter(p => p.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((s, p) => s + (p.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(p => p.id === id);
  }
}