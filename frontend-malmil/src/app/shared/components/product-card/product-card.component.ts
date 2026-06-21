import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyIdrPipe } from '../../pipes/currency-idr.pipe';
import { resolveImageUrl } from 'app/core/utils/image-url';

export interface ProductCardItem {
    id: string;
    slug: string;
    name: string;
    base_price: number;
    images?: { url: string; is_primary?: boolean }[];
}

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    standalone: true,
    imports: [NgIf, RouterLink, CurrencyIdrPipe],
})
export class ProductCardComponent {
    @Input() product!: ProductCardItem;

    get primaryImage(): string | null {
        if (!this.product.images?.length) return null;
        const primary = this.product.images.find((img) => img.is_primary);
        return resolveImageUrl(primary?.url || this.product.images[0].url);
    }
}
