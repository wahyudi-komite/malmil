import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { CurrencyIdrPipe } from '../../../shared/pipes/currency-idr.pipe';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgForOf, FormsModule, RouterLink, CurrencyIdrPipe],
})
export class ProductDetailComponent implements OnInit {
    Math = Math;
    product: any = null;
    selectedVariant: any = null;
    quantity = 1;
    selectedImage = '';
    added = false;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.productService.getBySlug(params['slug']).subscribe((product) => {
                this.product = product;
                this.selectedVariant = product.variants?.[0] || null;
                this.selectedImage = product.images?.find((img: any) => img.is_primary)?.url || product.images?.[0]?.url || '';
            });
        });
    }

    selectVariant(variant: any) {
        this.selectedVariant = variant;
        this.quantity = 1;
        this.added = false;
    }

    get price(): number {
        if (this.selectedVariant?.price_override) return Number(this.selectedVariant.price_override);
        return Number(this.product?.base_price || 0);
    }

    addToCart() {
        if (!this.selectedVariant) return;
        this.cartService.addItem(this.selectedVariant.id, this.quantity).subscribe(() => {
            this.added = true;
            setTimeout(() => (this.added = false), 2000);
        });
    }
}
