import { IBuyer } from '../../types';

export class BuyerModel {
    private data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: ''
    };

    setField<K extends keyof IBuyer>(key: K, value: IBuyer[K]): void {
        this.data[key] = value;
    }

    getData(): IBuyer {
        return { ...this.data };
    }

    clear(): void {
        this.data = {
            payment: null,
            email: '',
            phone: '',
            address: ''
        };
    }
}
