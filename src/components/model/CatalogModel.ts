import { IProduct } from '../../types';
import { events } from '../../main';

export class CatalogModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = [...items];
    events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find(i => i.id === id);
  }

  setPreviewById(id: string): void {
    const product = this.getItem(id);
    this.preview = product ?? null;
    events.emit('preview:changed');
  }

  setPreview(product: IProduct | null): void {
    this.preview = product;
    events.emit('preview:changed');
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}