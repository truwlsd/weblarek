
import { IProduct } from '../../types';

export class CatalogModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = [...items];
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find(i => i.id === id);
  }

  setPreviewById(id: string): void {
    this.preview = this.getItem(id) ?? null;
  }

  setPreview(product: IProduct | null): void {
    this.preview = product;
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
